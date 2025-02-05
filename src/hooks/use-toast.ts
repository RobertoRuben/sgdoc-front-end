/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
"use client"

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

/**
 * Ajusta estos valores según tu preferencia.
 * TOAST_LIMIT: máximo de toasts que pueden estar visibles simultáneamente.
 * TOAST_REMOVE_DELAY: tiempo en milisegundos para que un toast sea eliminado del estado después de cerrarse.
 */
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

/**
 * Extendemos ToastProps (de tu librería UI) omitiendo "title" y "description",
 * y añadiendo nuestras propias definiciones para que sean ReactNode.
 */
type ExtendedToastProps = Omit<ToastProps, "title" | "description"> & {
  title?: React.ReactNode
  description?: React.ReactNode
}

/**
 * Este será el tipo principal que maneja nuestro reducer y que se mostrará en la interfaz.
 */
type ToasterToast = ExtendedToastProps & {
  id: string
  action?: ToastActionElement
}

/**
 * Acciones posibles en nuestro reducer
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type ActionType = typeof actionTypes

type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

/**
 * Estado global de todos los toasts activos.
 */
interface State {
  toasts: ToasterToast[]
}

/**
 * Guarda los timeouts para borrar los toasts después de cerrarlos.
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Reducer principal que maneja la lógica de añadir, actualizar, cerrar y eliminar toasts.
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST":
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id))
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // Eliminamos todos
        return { ...state, toasts: [] }
      }
      // Eliminamos solo uno
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

/**
 * Array de listeners para notificar a todos los que usan el hook cuando
 * el estado cambia.
 */
const listeners: Array<(state: State) => void> = []

/**
 * Estado en memoria global del que se alimentan los listeners (useState).
 */
let memoryState: State = { toasts: [] }

/**
 * Despacho centralizado de acciones al reducer.
 * Actualiza el estado global y llama a todos los listeners.
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

/**
 * Añade un toast a la cola de "remoción" después de un tiempo para limpiarlo del estado.
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Genera IDs únicos para cada toast.
 */
let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

/**
 * Este tipo representa lo que puede recibir la función `toast(...)`.
 * Internamente, se le añade un ID en el reducer.
 */
type Toast = Omit<ToasterToast, "id">

/**
 * Función principal para disparar un nuevo toast.
 */
function toast({ ...props }: Toast) {
  const id = genId()

  const update = (updateProps: Partial<ToasterToast>) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...updateProps, id } })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      // Cuando open cambie a false, se descarta.
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

/**
 * Hook para suscribirse a los cambios en los toasts.
 * Provee la función `toast(...)` y también `dismiss(...)` para cerrar un toast en particular.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Exponemos el estado y las funciones
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

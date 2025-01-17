import { Documentos, Remitentes, Derivaciones, CaseriosData } from '@/model/inicio';

export const datosIniciales: {
  documentos: Documentos;
  remitentes: Remitentes;
  derivaciones: Derivaciones;
  caserios: CaseriosData;
} = {
  documentos: {
    documentosIngresadosHoy: 15
  },
  remitentes: {
    nuevosRemitentesRegistrados: 3
  },
  derivaciones: {
    derivadosHoy: 10,
    pendientesPorDerivar: 8
  },
  caserios: {
    documentosPorCaserio: [
      { name: "Caserío A", documentos: 5 },
      { name: "Caserío B", documentos: 3 },
      { name: "Caserío C", documentos: 7 },
      { name: "Caserío D", documentos: 2 },
      { name: "Caserío E", documentos: 4 },
    ]
  }
};
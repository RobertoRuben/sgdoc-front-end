import React from 'react'
import { CheckIcon } from '@radix-ui/react-icons'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  isStepComplete: boolean[]
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps, isStepComplete }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                isStepComplete[index]
                  ? 'bg-[#028a3b] border-[#028a3b] text-white' 
                  : index === currentStep - 1
                    ? 'border-[#028a3b] text-[#028a3b]' 
                    : 'border-gray-300 text-gray-300'
              }`}
            >
              {isStepComplete[index] ? (
                <CheckIcon className="w-6 h-6" />
              ) : (
                index + 1
              )}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              index < currentStep || isStepComplete[index] ? 'text-[#028a3b]' : 'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
        <div 
          className="bg-[#028a3b] h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${((currentStep - 1 + (isStepComplete[currentStep - 1] ? 1 : 0)) / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar

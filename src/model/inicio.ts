// interfaces/documentos.interface.ts
export interface Documentos {
    documentosIngresadosHoy: number;
  }
  
  // interfaces/remitentes.interface.ts
  export interface Remitentes {
    nuevosRemitentesRegistrados: number;
  }
  
  // interfaces/derivaciones.interface.ts
  export interface Derivaciones {
    derivadosHoy: number;
    pendientesPorDerivar: number;
  }
  
  // interfaces/caserios.interface.ts
  export interface CaserioDocumento {
    name: string;
    documentos: number;
  }
  
  export interface CaseriosData {
    documentosPorCaserio: CaserioDocumento[];
  }
  
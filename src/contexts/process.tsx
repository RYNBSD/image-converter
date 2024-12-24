import type { ChildrenProps } from "../types/props";
import { createContext, useCallback, useContext, useState } from "react";

type ProcessStatus =
  | "pending-read"
  | "reading"
  | "pending-convert"
  | "converting"
  | "pending-download"
  | "downloading"
  | "success"
  | "error";

export type Process = {
  id: number;
  file: File;
  progress: number; // 0 - 1, reading progress
  status: ProcessStatus;
  buffer: Buffer | null;
  error: Error | null;
};
type Processes = Process[];

type ProcessKeys = keyof Process;

type ProcessValues<K extends ProcessKeys> = Process[K];

type ProcessValue = {
  processes: Processes;
  addProcesses: AddProcessFn;
  updateProcess: UpdateProcessFn;
  removeProcess: RemoveProcessFn;
};

const ProcessContext = createContext<ProcessValue | null>(null);

type AddProcessFn = (processes: Process | Process[]) => void;

type UpdateProcessFn = <K extends ProcessKeys>(
  id: number,
  key: K,
  newValue: ProcessValues<K>
) => void;

type RemoveProcessFn = (id: number) => void;

export default function ProcessProvider({ children }: ChildrenProps) {
  const [processes, setProcesses] = useState<Process[]>([]);

  const addProcesses = useCallback<AddProcessFn>((processes) => {
    const newProcesses = Array.isArray(processes) ? processes : [processes];
    setProcesses((prev) => [...prev, ...newProcesses]);
  }, []);

  const updateProcess = useCallback<UpdateProcessFn>((id, key, newValue) => {
    setProcesses((prev) => {
      return prev.map((process) => {
        if (process.id === id) {
          return { ...process, [key]: newValue };
        }
        return process;
      });
    });
  }, []);

  const removeProcess = useCallback((id: number) => {
    setProcesses((prev) => prev.filter((process) => process.id !== id));
  }, []);

  return (
    <ProcessContext.Provider
      value={{ processes, addProcesses, updateProcess, removeProcess }}
    >
      {children}
    </ProcessContext.Provider>
  );
}

export const useProcess = () => useContext(ProcessContext);

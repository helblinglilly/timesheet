import { format } from "date-fns";

export function TimeRecord({ dateString, copy }: {
  dateString: string | null | undefined,
  copy?: string | null | undefined
}){

  return (
    <div className="inline-flex gap-2 select-text h-6">
      <p className="w-12 font-mono text-center">{
        dateString ? format(new Date(dateString), 'HH:mm') : "\u00A0"
      } </p>
      <p>{ dateString ? copy : "\u00A0"}</p>
    </div>
  )
}

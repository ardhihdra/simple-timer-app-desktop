import '../assets/log-list.css';
import { LogType } from "../types";
import { formatDistanceStrict } from "date-fns";

export type LogListProps = {
  logs: LogType[]
}

export default function LogList({ logs = [] }: LogListProps) {
  return (
    <div className="log-container">
      {
        logs.map((log, idx) => {
          return (
            <div key={log._id ?? idx} className="log">
              <div className="flex mb-10">
                <div className="start-log">Started at: {log.startTime.toLocaleString()}</div>
                <div className="duration-log">
                  {formatDistanceStrict(log.startTime, log.endTime)}
                </div>
              </div>
              <div className="note"></div>
            </div>
          )
        })
      }
    </div>
  )
}
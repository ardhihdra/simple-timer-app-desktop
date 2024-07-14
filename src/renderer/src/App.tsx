import electronLogo from './assets/icon.png'
import { useCallback, useEffect, useState } from 'react';
import LogList from './components/LogList';
import { LogType, UserType } from './types';
import Timer from './components/Timer';
import TimerStats from './components/TimerStats';

function App(): JSX.Element {
  const [user, setUser] = useState<UserType>();
  const [account, setAccount] = useState<UserType>();
  const [showForm, setShowForm] = useState<boolean>();
  const [state, setState] = useState<string>();
  const [startTime, setStartTime] = useState<Date>();
  const [logs, setLogs] = useState<LogType[]>([]);
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  useEffect(() => {
    const handlePingData = (_) => {
      // console.log('IP!', data); // Outputs: Hello from Main Process
    };

    const handleLogData = (data: LogType[]) => {
      setLogs(data);
    };

    const handlePostLogData = (_: LogType[]) => {
      fetchLogs();
    };

    window.api.onPingData(handlePingData);
    window.api.onLogData(handleLogData);
    window.api.onPostLogData(handlePostLogData);

    return () => {
      window.api.onPingData(() => {}); // Cleanup listener
      window.api.onLogData(() => {});
      window.api.onPostLogData(() => {});
    };
  }, []);

  useEffect(() => {
    fetchLogs();
    // ipcHandle();
  }, [account]);

  const toggleLoginForm = () => {
    setShowForm((prev) => !prev);
  }

  const handleFormChange = (e) => {
    setUser((prev) => ({ ...(prev ?? {}), [e.target.name]: e.target.value }));
  }

  const handleLogin = async () => {
    setAccount({...(user ?? {})});
    setUser(undefined);
    setShowForm(false);
  }

  const handleLogout = () => {
    setAccount(undefined);
    setLogs([]);
  }

  const fetchLogs = useCallback(() => {
    if (account) {
      window.electron.ipcRenderer.send('fetch-logs', account);
    }
  }, [account]);

  const sendLogToServer = async (payload: LogType) => {
    window.electron.ipcRenderer.send('add-log', payload);
  }

  const startStopTimer = async () => {
    if (state !== 'start') {
      startTimer();
    } else {
      stopTimer();
    }
  }

  const startTimer = async () => {
    if (account) {
      setState('start');
      setStartTime(new Date());
    } else {
      setShowForm(true);
    }
  };

  // const pauseTimer = async () => {
  //   setState('pause');
  // };

  /** */
  const stopTimer = () => {
    setState('stop');
    const endAt = new Date();
    if (startTime) {
      sendLogToServer({
        email: account?.email,
        startTime: startTime,
        endTime: endAt,
        duration: Math.floor((endAt.getTime() - startTime.getTime()) / 1000),
        notes: ''
      });
      // setLogs((prev) => ([
      //   {
      //     _id: `${Math.random}`,
      //     startTime: startTime,
      //     endTime: endAt,
      //     duration: Math.floor((endAt.getTime() - startTime.getTime()) / 1000),
      //     notes: ''
      //   },
      //   ...prev
      // ]));
    }
  };

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Batari Timer</div>
      <div className="text">
        Work with maximum <span className="react">Productivity</span>
        &nbsp;and <span className="ts">Responsibility</span>
      </div>
      {/* <p className="tip">
        Start <code>working</code>
      </p> */}
      {
        account ? (
          <div className="toolbar gap">
            <button onClick={toggleLoginForm}>
              Hi! {account.email}
            </button>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="toolbar">
            <button onClick={toggleLoginForm}>
              Login
            </button>
          </div>
        )
      }
      {
        showForm && (
          <form className="login-form" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" name="email" onChange={handleFormChange} />
            {/* <input type="password" placeholder="Password" name="password" onChange={handleFormChange} /> */}
            <button type="submit">Submit</button>
          </form>
        )
      }
      <div className="actions">
        <Timer status={state ?? 'stop'} />
        {/* <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div> */}
      </div>
      <div className="actions">
        <TimerStats logs={logs} />
      </div>
      <div className="actions">
        <div className="action">
          <button onClick={startStopTimer} rel="noreferrer" style={{ color: state === 'start' ? 'red' : 'green' }}>
            { !state || state === 'stop' ? 'Start' : 'Stop' }
          </button>
        </div>
        {/* <div className="action">
          <button onClick={stopTimer} rel="noreferrer" style={{ color: state === 'stop' ? 'red' : '' }}>
            Stop
          </button>
        </div> */}
      </div>
      <div>
        <LogList logs={logs} />
      </div>
      {/* <Versions></Versions> */}
    </>
  )
}

export default App

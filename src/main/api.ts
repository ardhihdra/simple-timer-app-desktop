require('dotenv').config();
import { net } from 'electron'
import { LogType, UserType } from './types';

export const fetchMyIP = async (event: Electron.IpcMainEvent) => {
  try {
    const response = await net.fetch('https://api.ipify.org?format=json');
    if (response.ok) {
      const data = await response.json();

      console.log('My public IP address is:', data.ip);
      event.sender.send('ping-data', data);
    } else {
      console.error('Failed to fetch public IP address');
    }
  } catch (error) {
    console.error('Error fetching public IP address:', error);
  }
}


export const fetchAllLog = async (event: Electron.IpcMainEvent, account: UserType) => {
  try {
    const response = await fetch(`${process.env.CORE_API}/logs?email=${account?.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      event.sender.send('log-data', result);
      return result;
    } else {
      console.error('Failed to fetch logs', response);
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
};

export const sendLogToServer = async (event: Electron.IpcMainEvent, payload: LogType) => {
  try {
    const response = await fetch(`${process.env.CORE_API}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      event.sender.send('post-log-data', result);
      console.log('Log sent successfully');
      await fetchAllLog(event, { email: payload?.email });
    } else {
      console.error('Failed to send log', response);
    }
  } catch (error) {
    console.error('Error sending log:', error);
  }
}
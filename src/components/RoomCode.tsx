import toast, { Toaster } from 'react-hot-toast';

import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss'

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {
  function showToast() {
      toast('Código copiado!',
      {
        duration: 1000,
        style: {
          borderRadius: '24px',
          background: '#333',
          color: '#F8F8F8',
        },
      }
    );
  } 

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
    showToast();
  }

  return (
    <>
      <button className="room-code" onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="Copy room code" />
        </div>

        <span>Sala { props.code }</span>
      </button>
      <Toaster />
    </>
  );
}


import { FormEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from 'react-router';

import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg'

import { database } from '../services/firebase';

import '../styles/auth.scss'

export function Home() {
  const { user, signInWithGoogle } = useAuth();
  
  const history = useHistory();

  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  function showRoomDoesNotExistToast() {
      toast('Esta sala não existe!',
      {
        duration: 2000,
        style: {
          borderRadius: '24px',
          background: '#333',
          color: '#F8F8F8',
        },
      }
    );
  } 

  function showRoomIsClosedToast() {
      toast('Esta sala já foi encerrada!',
      {
        duration: 2000,
        style: {
          borderRadius: '24px',
          background: '#333',
          color: '#F8F8F8',
        },
      }
    );
  } 

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      showRoomDoesNotExistToast();
      return;
    }

    if (roomRef.val().endedAt) {
      showRoomIsClosedToast();
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        
        <strong>Crie salas de Q&amp;A ao-vivo.</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo da Letmeask" />
          
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>
         
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>

      <Toaster />
    </div>
  );
}

import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import endRoomImg from '../assets/images/end-room.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import deleteRedImg from '../assets/images/delete-red.svg';

import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [openEndRoomModal, setOpenEndRoomModal] = useState(false);
  const [openDeleteQuestionModal, setOpenDeleteQuestionModal] = useState(false);
  const [questionId, setQuestionId] = useState('');

  const { title, questions } = useRoom(roomId);

  const history = useHistory();

  function handleOpenEndRoomModal() {
    setOpenEndRoomModal(true);
  }

  function handleCloseEndRoomModal() {
    setOpenEndRoomModal(false);
  }

  function handleOpenDeleteQuestionModal(questionId: string) {
    setQuestionId(questionId);
    setOpenDeleteQuestionModal(true);
  }
  function handleCloseDeleteQuestionModal() {
    setOpenDeleteQuestionModal(false);
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    setOpenEndRoomModal(false);
    history.push('/');
  }
  
  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }
  
  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }
  
  async function handleDeleteQuestion(questionId: string) {
    handleCloseDeleteQuestionModal();

    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo da Letmeask" />

          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleOpenEndRoomModal} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <Modal
        icon={endRoomImg}
        title="Encerrar sala"
        subtitle="Tem certeza que você deseja encerrar esta sala?"
        confirmButtonText="Sim, encerrar"
        isOpened={openEndRoomModal}
        onCancel={handleCloseEndRoomModal}
        onConfirm={handleEndRoom}
      />
      
      <main>
        <div className="room-title">
          <h1>Sala { title }</h1>
          { questions.length > 0 && <span>{ questions.length } pergunta(s)</span> }
        </div>

        {questions.length === 0 
          ? (
            <div className="empty-questions">
              <img src={emptyQuestionsImg} alt="Ilustração de perguntas" />

              <h3>Nenhuma pergunta por aqui...</h3>
              <p>
                Envie o código desta sala para seus amigos e comece a responder perguntas!
              </p>
            </div>
          )

          : (
              <div className="question-list">

              {questions.map(question => {
                return (
                  <Question 
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    { !question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida" />
                        </button>
        
                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Dar destaque à pergunta" />
                        </button>
                      </>
                    ) }
    
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteQuestionModal(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>

                  </Question>
                );
              })}

              <Modal
                icon={deleteRedImg}
                title="Excluir pergunta"
                subtitle="Tem certeza que você deseja excluir esta pergunta?"
                confirmButtonText="Sim, excluir"
                isOpened={openDeleteQuestionModal}
                onCancel={handleCloseDeleteQuestionModal}
                onConfirm={() => handleDeleteQuestion(questionId)}
              />
            </div>
          )
        }
      </main>
    </div>
  );
}

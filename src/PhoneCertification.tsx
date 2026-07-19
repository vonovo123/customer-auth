import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CERTIFICATION_SECONDS = 180;

interface PhoneCertificationProps {
  token: string;
  code: string;
  isLoading: boolean;
  isReLoading: boolean;
  onChangeCode: (value: string) => void;
  onClickSubmitBtn: () => void;
  onClickReRegistBtn: () => void;
}

const digitsOnly = (value: string, maxLength: number) =>
  value.replace(/\D/g, '').slice(0, maxLength);

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${minutes}:${remain < 10 ? `0${remain}` : remain}`;
}

function PhoneCertification({
  token,
  code,
  isLoading,
  isReLoading,
  onChangeCode,
  onClickSubmitBtn,
  onClickReRegistBtn,
}: PhoneCertificationProps) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(CERTIFICATION_SECONDS);
  const [isFormValid, setIsFormValid] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!token) {
      alert('잘못된 접근입니다. 처음부터 다시 진행해주세요.');
      navigate('/identity-authentication', { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    clearTimer();
    expiredRef.current = false;
    setTimeLeft(CERTIFICATION_SECONDS);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          expiredRef.current = true;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [token]);

  useEffect(() => {
    if (timeLeft === 0 && expiredRef.current) {
      expiredRef.current = false;
      clearTimer();
      alert('인증가능시간이 만료되었습니다. 처음화면으로 돌아갑니다.');
      navigate('/identity-authentication', { replace: true });
    }
  }, [timeLeft, navigate]);

  useEffect(() => {
    setIsFormValid(code !== '');
  }, [code]);

  const doneClass = isFormValid ? 'done' : '';

  return (
    <main className="component">
      <div className="wrapper">
        <header>
          <h2>휴대폰 번호로 전송된</h2>
          <h2>인증번호를 입력해 주세요.</h2>
        </header>
        <div className="body">
          <fieldset>
            <legend>
              인증번호
              <span className="timer">{formatTimer(timeLeft)}</span>
            </legend>
            <div className="input-wrapper">
              <input
                className="input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => onChangeCode(digitsOnly(e.target.value, 6))}
              />
              <div
                className="re-regist"
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (isReLoading) return;
                  onClickReRegistBtn();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isReLoading) return;
                    onClickReRegistBtn();
                  }
                }}
              >
                {isReLoading ? (
                  <span className="loading">
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                  </span>
                ) : (
                  '재전송'
                )}
              </div>
            </div>
          </fieldset>
          <button
            type="button"
            className={`next-btn ${doneClass}`}
            onClick={() => {
              if (!isFormValid || isLoading) return;
              onClickSubmitBtn();
            }}
          >
            {isLoading ? (
              <span className="loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </span>
            ) : (
              '본인인증하기'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

export default PhoneCertification;

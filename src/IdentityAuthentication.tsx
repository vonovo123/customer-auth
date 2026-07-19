import { useEffect, useState } from 'react';
import type { CivilCodeParts, PhoneParts } from './types/api';

interface IdentityAuthenticationProps {
  phoneNumber: PhoneParts;
  civilCode: CivilCodeParts;
  name: string;
  isLoading: boolean;
  onChangePhoneNumber: (index: number, value: string) => void;
  onChangeCivilCode: (index: number, value: string) => void;
  onChangeName: (value: string) => void;
  onClickRegistBtn: () => void;
}

const digitsOnly = (value: string, maxLength: number) =>
  value.replace(/\D/g, '').slice(0, maxLength);

function IdentityAuthentication({
  phoneNumber,
  civilCode,
  name,
  isLoading,
  onChangePhoneNumber,
  onChangeCivilCode,
  onChangeName,
  onClickRegistBtn,
}: IdentityAuthenticationProps) {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const phoneFilled = phoneNumber.every((part) => part !== '');
    const civilFilled = civilCode.every((part) => part !== '');
    setIsFormValid(phoneFilled && civilFilled && name.trim() !== '');
  }, [phoneNumber, civilCode, name]);

  const doneClass = isFormValid ? 'done' : '';

  return (
    <main className="component">
      <div className="wrapper">
        <header>
          <h2>비대면 대출을 위해 본인인증이 필요해요.</h2>
        </header>
        <div className="body">
          <fieldset>
            <legend>휴대폰 번호</legend>
            <div className="input-wrapper">
              <input
                className="input phonenum"
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={phoneNumber[0]}
                onChange={(e) =>
                  onChangePhoneNumber(0, digitsOnly(e.target.value, 3))
                }
              />
              <span className="dash">-</span>
              <input
                className="input phonenum"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={phoneNumber[1]}
                onChange={(e) =>
                  onChangePhoneNumber(1, digitsOnly(e.target.value, 4))
                }
              />
              <span className="dash">-</span>
              <input
                className="input"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={phoneNumber[2]}
                onChange={(e) =>
                  onChangePhoneNumber(2, digitsOnly(e.target.value, 4))
                }
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>주민등록번호</legend>
            <div className="input-wrapper">
              <input
                className="input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="앞 6자리"
                value={civilCode[0]}
                onChange={(e) =>
                  onChangeCivilCode(0, digitsOnly(e.target.value, 6))
                }
              />
              <input
                className="input"
                type="password"
                inputMode="numeric"
                maxLength={7}
                placeholder="뒤 7자리"
                value={civilCode[1]}
                onChange={(e) =>
                  onChangeCivilCode(1, digitsOnly(e.target.value, 7))
                }
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>이름</legend>
            <div className="input-wrapper">
              <input
                className="input"
                type="text"
                placeholder="이름을 입력해 주세요."
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
              />
            </div>
          </fieldset>
          <button
            type="button"
            className={`next-btn ${doneClass}`}
            onClick={() => {
              if (isLoading || !isFormValid) return;
              onClickRegistBtn();
            }}
          >
            {isLoading ? (
              <span className="loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </span>
            ) : (
              '다음'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

export default IdentityAuthentication;

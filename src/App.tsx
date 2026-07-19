import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { fetchCertification } from './api/client';
import IdentityAuthentication from './IdentityAuthentication';
import PhoneCertification from './PhoneCertification';
import type { CivilCodeParts, PhoneParts } from './types/api';
import './styles.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState<PhoneParts>(['010', '', '']);
  const [civilCode, setCivilCode] = useState<CivilCodeParts>(['', '']);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReLoading, setIsReLoading] = useState(false);
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');

  const navigate = useNavigate();

  const onChangePhoneNumber = (index: number, value: string) => {
    const next = [...phoneNumber] as PhoneParts;
    next[index] = value;
    setPhoneNumber(next);
  };

  const onChangeCivilCode = (index: number, value: string) => {
    const next = [...civilCode] as CivilCodeParts;
    next[index] = value;
    setCivilCode(next);
  };

  const clearForm = () => {
    setCode('');
    setPhoneNumber(['010', '', '']);
    setCivilCode(['', '']);
    setName('');
    setToken('');
  };

  const requestCertification = async (options?: {
    isResend?: boolean;
  }): Promise<boolean> => {
    const isResend = options?.isResend ?? false;
    const setPending = isResend ? setIsReLoading : setIsLoading;

    const payload = {
      name,
      civilcodeFirst: civilCode[0],
      civilCodeLast: civilCode[1],
      mobile: phoneNumber.join(''),
    };

    try {
      setPending(true);
      const result = await fetchCertification('request', payload);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.response?.token) {
        throw new Error('토큰을 받지 못했습니다. 다시 시도해주세요.');
      }
      setToken(result.response.token);
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
      return false;
    } finally {
      setPending(false);
    }
  };

  const onClickRegistBtn = async () => {
    const ok = await requestCertification();
    if (ok) {
      navigate('/phone-certification');
    }
  };

  const onClickReRegistBtn = async () => {
    const ok = await requestCertification({ isResend: true });
    if (ok) {
      setCode('');
      alert('인증번호가 재전송 되었습니다.');
    } else {
      setCode('');
    }
  };

  const onClickSubmitBtn = async () => {
    // TODO: 실제 API 연동 시 fetchCertification('submit', { token, code }) 호출로 교체
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
    setCode('');
    alert('인증완료');
    navigate('/');
    clearForm();
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/identity-authentication" replace />}
      />
      <Route
        path="/identity-authentication"
        element={
          <IdentityAuthentication
            phoneNumber={phoneNumber}
            civilCode={civilCode}
            name={name}
            isLoading={isLoading}
            onChangePhoneNumber={onChangePhoneNumber}
            onChangeCivilCode={onChangeCivilCode}
            onChangeName={setName}
            onClickRegistBtn={onClickRegistBtn}
          />
        }
      />
      <Route
        path="/phone-certification"
        element={
          <PhoneCertification
            token={token}
            code={code}
            isLoading={isLoading}
            isReLoading={isReLoading}
            onChangeCode={setCode}
            onClickSubmitBtn={onClickSubmitBtn}
            onClickReRegistBtn={onClickReRegistBtn}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

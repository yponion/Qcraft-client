import { useEffect, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Chat from "../components/Chat";
import "./AIPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { interviewApi } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

const AIPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState<string[]>(["", "", ""]);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) {
        navigate("/");
      } else {
        try {
          setIsLoading(true);
          const res = await interviewApi.generate(id);
          setInterviewId(res.data.interviewId);
          setQuestions(res.data.questions);
        } catch (error) {
          alert("문제가 발생했습니다. 다시 시도해주세요.");
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [id, navigate]);

  const handleChange = (index: number, value: string) => {
    const newValues = [...answers];
    newValues[index] = value;
    setAnswers(newValues);
  };

  const handleFeedback = async () => {
    // 로딩
    const res = await interviewApi.feedback(interviewId, answers);
    console.log(res);
    // navigate("/histories/history/1");
  };

  if (isLoading) return <LoadingSpinner message="질문 생성 중..." />;
  return (
    <HelmetProvider>
      <Helmet>
        <title>AI 인터뷰</title>
      </Helmet>
      <div className="ai-container">
        <div className="ai-inner">
          {questions.map((v, i) => (
            <section key={i} className="ai-section">
              <Chat
                question={v}
                answer={answers[i]}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </section>
          ))}
        </div>
      </div>
      <div className="ai-submit-container">
        <button className="ai-submit-button" onClick={handleFeedback}>
          면접 종료{/* todo 시간 뛰워주고 hover시 면접 종료 뜨게 */}
        </button>
        <div className="ai-submit-button-border"></div>
      </div>
    </HelmetProvider>
  );
};

export default AIPage;

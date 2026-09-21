import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, CheckCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    type: 'multiple',
    question: "She _____ to the store every morning.",
    options: ["go", "goes", "going", "gone"],
    answer: "goes"
  },
  {
    id: 2,
    type: 'multiple',
    question: "I have _____ finished my homework.",
    options: ["already", "yet", "still", "soon"],
    answer: "already"
  },
  {
    id: 3,
    type: 'multiple',
    question: "If I _____ rich, I would travel the world.",
    options: ["am", "will be", "was", "were"],
    answer: "were"
  },
  {
    id: 4,
    type: 'multiple',
    question: "Choose the correct sentence:",
    options: [
      "She don't like coffee.",
      "She doesn't likes coffee.",
      "She doesn't like coffee.",
      "She not like coffee."
    ],
    answer: "She doesn't like coffee."
  },
  {
    id: 5,
    type: 'multiple',
    question: 'What is the past tense of "go"?',
    options: ["goed", "went", "gone", "goes"],
    answer: "went"
  },
  {
    id: 6,
    type: 'multiple',
    question: "The book is _____ the table.",
    options: ["in", "on", "at", "of"],
    answer: "on"
  },
  {
    id: 7,
    type: 'multiple',
    question: "They _____ to school yesterday.",
    options: ["go", "goes", "went", "gone"],
    answer: "went"
  },
  {
    id: 8,
    type: 'multiple',
    question: "Which word is an adjective?",
    options: ["quickly", "run", "beautiful", "eat"],
    answer: "beautiful"
  },
  {
    id: 9,
    type: 'multiple',
    question: "_____ you speak English?",
    options: ["Do", "Does", "Can", "Is"],
    answer: "Can"
  },
  {
    id: 10,
    type: 'multiple',
    question: "She is _____ than her sister.",
    options: ["tall", "more tall", "taller", "tallest"],
    answer: "taller"
  },
];

function getLevel(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { level: 'Advanced', cefr: 'C1', desc: 'Kemampuan Anda sangat tinggi! Siap untuk simulasi TOEFL/IELTS.' };
  if (pct >= 70) return { level: 'Upper Intermediate', cefr: 'B2', desc: 'Anda memahami teks akademik. Lanjutkan ke latihan yang lebih kompleks.' };
  if (pct >= 50) return { level: 'Intermediate', cefr: 'B1', desc: 'Anda memiliki dasar yang kuat. Tingkatkan kemampuan grammar menengah Anda.' };
  if (pct >= 30) return { level: 'Elementary', cefr: 'A2', desc: 'Anda memahami percakapan dasar. Perkuat grammar dasar Anda.' };
  return { level: 'Beginner', cefr: 'A1', desc: 'Anda baru mulai belajar. Kuasai kosakata dan kalimat sederhana terlebih dahulu.' };
}

export default function PlacementTest() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();
  const setHasTakenTest = useAuthStore(state => state.setHasTakenTest);

  const progress = (currentQ / questions.length) * 100;

  const handleNext = () => {
    const updatedAnswers = [...answers, selectedOption];
    setAnswers(updatedAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption('');
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const score = answers.reduce((acc, ans, idx) => acc + (ans === questions[idx].answer ? 1 : 0), 0);
    const result = getLevel(score, questions.length);

    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-3">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Placement Test Selesai!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-5">
            <div>
              <p className="text-muted-foreground">Skor kamu:</p>
              <p className="text-5xl font-extrabold text-primary mt-1">{score}<span className="text-2xl text-muted-foreground">/{questions.length}</span></p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl space-y-2">
              <p className="text-sm text-muted-foreground">Level yang ditetapkan</p>
              <p className="text-2xl font-bold text-primary">{result.level}</p>
              <p className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full inline-block">Setara CEFR {result.cefr}</p>
              <p className="text-sm text-muted-foreground mt-2">{result.desc}</p>
            </div>
            <Button className="w-full text-base h-12" onClick={() => {
              setHasTakenTest(true);
              navigate('/dashboard');
            }}>
              <BookOpen className="mr-2 h-5 w-5" />
              Mulai Belajar di Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/40 p-4 md:p-8">
      <div className="max-w-2xl w-full mx-auto space-y-6 flex-1 flex flex-col justify-center">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>EduClass — Placement Test</span>
            <span>Soal {currentQ + 1} dari {questions.length}</span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>

        <Card className="border-2">
          <CardHeader>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Pilih jawaban yang benar</p>
            <CardTitle className="text-xl md:text-2xl leading-relaxed">{q.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all font-medium text-base
                  ${selectedOption === opt
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted'}`}
                onClick={() => setSelectedOption(opt)}
              >
                <span className="mr-3 text-muted-foreground font-normal">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            ))}
          </CardContent>
          <div className="px-6 pb-6">
            <Button
              className="w-full text-base h-12"
              disabled={!selectedOption}
              onClick={handleNext}
            >
              {currentQ === questions.length - 1 ? 'Selesaikan Tes' : 'Selanjutnya →'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

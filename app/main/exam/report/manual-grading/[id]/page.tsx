'use client';

import React, { useEffect, useState } from 'react';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { apiUrl } from '@/lib/env';
import { getBearerHeader } from '@/app/_services/getBearerHeader.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import parse from 'html-react-parser'

export default function ProctoringLog({ params }: any) {
  const examResultId = params.id;
  const [examResultData, setExamResultData] = useState<any>(null);
  const [allowedStudentData, setAllowedStudentData] = useState<any[]>([]);
  const [essayAnswers, setEssayAnswers] = useState<any[]>([]);
  const [grades, setGrades] = useState<Record<number, { score: number; isCorrect: boolean }>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/exam-result/${examResultId}`,
          getBearerHeader(localStorage.getItem('token')!)
        );
        setExamResultData(data.data);
        fetchEssayAnswers();
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to fetch data');
      }
    };
    
    fetchData();
  }, [examResultId]);

  const fetchEssayAnswers = async () => {
    try {
      const essayRes = await axios.get(
        `${apiUrl}/exam/${examResultId}/essayAnswer`,
        getBearerHeader(localStorage.getItem('token')!)
      );
      setEssayAnswers(essayRes.data.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to fetch essay answers');
    }
  };

  const calculateTotalScore = async () => {
    try{
      const score = await axios.patch(
        `${apiUrl}/exam-result/${examResultId}/calculate-score`,
        getBearerHeader(localStorage.getItem('token')!)
      );
      setEssayAnswers(score.data.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to fetch essay answers');
    }
  }

  const handleInputChange = (answerId: number, field: 'score' | 'isCorrect', value: any) => {
    setGrades((prev) => ({
      ...prev,
      [answerId]: { ...prev[answerId], [field]: value },
    }));
    console.log(`Updated ${field} for ID ${answerId}:`, value); // Debugging
  };

  const submitGrade = async (answerId: number) => {
    const { score, isCorrect } = grades[answerId] || {};
    if (score === undefined) return toast.error('Score is required');

    try {
      await axios.patch(
        `${apiUrl}/exam-result/${answerId}/grade`,
        { score, isCorrect },
        getBearerHeader(localStorage.getItem('token')!)
      );
      toast.success('Grade submitted successfully');
      fetchEssayAnswers();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to submit grade');
    }
  };

  return (
    <ContentLayout title="Exam">
      <Card className="w-full p-10 min-h-[calc(100vh-180px)]">
        <h3 className="font-bold mb-5 text-3xl">Manual Check</h3>
        <Button onClick={() => router.back()}>
          <ArrowLeft /> Back
        </Button>
        {essayAnswers.length > 0 ? (
          <div className="border rounded-lg mt-4 p-6">
          <h4 className="font-bold text-lg mb-3">Essay Answers</h4>
        
          <div className="space-y-4">
            {essayAnswers.map((answer) => (
              <div key={answer.id} className="border p-5 rounded-lg">
                <h5 className="font-semibold text-base">Question:</h5>
                <p className="text-sm mb-2">{parse(answer.question.content)}</p>
        
                <h5 className="font-semibold text-base mt-4">Answer:</h5>
                <p className="text-sm mb-3">{answer.answer?.text || 'No answer given'}</p>
        
                {/* Score Card */}
                <Card className="w-[100px] mt-3">
                  <CardHeader>
                    <CardTitle className="text-center text-sm">Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-10">
                    <p className="text-center text-base">{answer.score || 'Not graded yet'}</p>
                  </CardContent>
                </Card>
        
                {/* Grading Input & Button */}
                <div className="mt-4 flex items-center gap-3">
                  <Input
                    type="number"
                    value={grades[answer.id]?.score ?? ''}
                    step="0.1"
                    min="0"
                    onChange={(e) => handleInputChange(answer.id, 'score', Number(e.target.value))}
                    placeholder="Enter Score"
                    className="w-28 h-10 text-sm px-3 border rounded-md"
                  />
                  <p className="text-sm text-muted-foreground">out of {answer.question.point}</p>
                  <Button onClick={() => submitGrade(answer.id)} className="w-32 h-11 px-4 text-sm">
                    Submit Grade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        ) : (
          <p className="text-center mt-5">No essay answers found.</p>
        )}
      </Card>
    </ContentLayout>
  );
}

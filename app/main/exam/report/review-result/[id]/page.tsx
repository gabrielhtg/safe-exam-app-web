'use client';

import React, { useEffect, useState } from 'react';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { apiUrl } from '@/lib/env';
import { getBearerHeader } from '@/app/_services/getBearerHeader.service';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import parse from 'html-react-parser';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function ReviewResult({ params }: any) {
  const examResultId = params.id;
  const [examResultData, setExamResultData] = useState<any>(null);
  const [essayAnswers, setEssayAnswers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/exam-result/${examResultId}`,
          getBearerHeader(localStorage.getItem('token')!)
        );
        setExamResultData(data.data);
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to fetch data');
      }
    };
    fetchData();
  }, [examResultId]);

  useEffect(() => {
    if (examResultData) {
      const fetchEssayAnswers = async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/exam/${examResultId}/review-result`,
            getBearerHeader(localStorage.getItem('token')!)
          );
          setEssayAnswers(data.data);
        } catch (e: any) {
          toast.error(e.response?.data?.message || 'Failed to fetch essay answers');
        }
      };
      fetchEssayAnswers();
    }
  }, [examResultData]);

  return (
    <ContentLayout title="review-result">
      <Card id={'card-utama'} className={'w-full p-10 h-[calc(100vh-180px)]'}>
        <h3 className={'font-bold text-xl mb-5'}>
          Result of {examResultData ? examResultData.title : ''} {examResultData?.course_title}
        </h3>
        <Button className='gap-3' onClick={() => router.back()}>
                  <ArrowLeft /> Back
        </Button>

        <div className={'flex gap-5 h-auto pb-10 mt-5'}>
          {/*sebelah kiri*/}
          <div
            className={
              'flex flex-col w-full overflow-y-scroll scroll-smooth border rounded-lg px-5 pb-5'
            }
          >
            {essayAnswers.map((answer: any, ansIndex) => (
              <div
                key={ansIndex}
                id={`${ansIndex}`}
                className={'flex gap-3 rounded-lg p-5 pb-0 mr-5'}
              >
                <div>{ansIndex + 1}.</div>
                <div className={'w-full h-auto'}>
                  {parse(answer.question.content)}
                  {answer.question.type === 'essay' ? (
                    <div className={'mt-3'}>
                      <span className={'font-bold'}>Your answer :</span>

                      <div className={'border w-full rounded-lg p-2 mt-1'}>
                        {parse(answer.answer ? answer.answer : 'Not Answered')}
                      </div>
                    </div>
                  ) : (
                    <RadioGroup
                      value={answer.answer}
                      className={'flex ms-5 flex-col mt-2'}
                    >
                      {answer.question.options.map((option: any, optionIndex: number) => {
                        // Tentukan apakah opsi ini terpilih
                        const isSelected =
                          answer.question.type === 'multiple'
                            ? answer.answer === option.id
                            : answer.question.type === 'check-box'
                            ? (answer.answer || []).includes(option.id)
                            : false;
                        // Tentukan kelas berdasarkan apakah opsi terpilih dan apakah benar
                        const optionClass = isSelected
                          ? option.isCorrect
                            ? 'bg-green-300'
                            : 'bg-red-300'
                          : '';
                        return (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <div>
                              {answer.question.type === 'multiple' && (
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem value={option.id} />
                                  {String.fromCharCode(97 + optionIndex)}.
                                </div>
                              )}
                              {answer.question.type === 'check-box' && (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${option.id}`}
                                    checked={(answer.answer || []).includes(option.id)}
                                  />
                                </div>
                              )}
                            </div>
                            <div className={optionClass + " p-1 rounded"}>
                              {answer.question.type === 'multiple' && (
                                <div>{parse(option.option)}</div>
                              )}
                              {answer.question.type === 'check-box' && (
                                <label
                                  htmlFor={`${option.id}`}
                                  className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {parse(option.option)}
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    </RadioGroup>
                  )}

                  <div className={'mt-2 text-muted-foreground'}>
                    Point : {answer.score} of {answer.question.point}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*sebelah kanan*/}
          <div className={'max-w-xs w-full flex flex-col gap-5'}>

            <div className={'border rounded-lg w-full flex flex-col p-5'}>
              <span className={'font-bold'}>Grade</span>

              <div className={'mt-3 text-center w-full text-3xl'}>
                {(
                  (examResultData?.total_score /
                    examResultData?.expected_score) *
                  100
                ).toFixed(2)}{' '}
                / 100.00
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ContentLayout>
  );
}

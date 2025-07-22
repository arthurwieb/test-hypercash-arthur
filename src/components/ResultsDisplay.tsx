// src/components/analysis/ResultsDisplay.tsx
"use client"; // Marca este componente como um Client Component

import { inputDataSchema } from '@/schemas/inputDataSchema';
import { AnalysisResult } from '@/types';
import { Button } from '@mantine/core';
import { z } from 'zod';
type InputDataForm = z.infer<typeof inputDataSchema>;

interface ResultsDisplayProps {
  analysisResult: AnalysisResult;
  formValues: InputDataForm; // Passamos os valores do formulário para o breakdown
  getLevelColorClass: (level: AnalysisResult['level']) => string;
  handleReset: () => void;
  handleCopyData: () => void;
}

const ResultsDisplay = ({
  analysisResult,
  formValues,
  getLevelColorClass,
  handleReset,
  handleCopyData,
}: ResultsDisplayProps) => {

  const renderBreakdownBars = () => {
    const maxScore = 100;
    const dateNow = Date.now();

    const breakdownValues = [
      { name: 'Valor base', value: formValues.val * 20, description: 'Valor decimal para cálculo base (w1). Contribui com 0.2 por unidade.' },
      { name: 'Flag 1 Ativa', value: formValues.flag1 ? 10 : 0, description: 'Indica se a flag 1 está ativa (w2). Contribui com 10 pontos se ativa.' },
      { name: 'Texto Longo', value: formValues.text.length > 4 ? 8 : 0, description: 'Comprimento do texto. Se maior que 4 caracteres (w3), contribui com 8 pontos.' },
      { name: 'Horário Noturno', value: (formValues.hour > 23 || formValues.hour < 6) ? 15 : 0, description: 'Hora do dia (0-23). Se fora do horário comercial (0-5h ou 24h), contribui com 15 pontos (w4).' },
      { name: 'Email Temporário', value: formValues.email.includes('@temp') ? 12 : 0, description: 'Endereço de e-mail. Se contém "@temp" (w5), contribui com 12 pontos.' },
      { name: 'Endereços Diferentes', value: formValues.addr1 !== formValues.addr2 ? 20 : 0, description: 'Primeiro endereço. Se diferente do segundo endereço (w6), contribui com 20 pontos.' },
      { name: 'Contador Alto', value: formValues.count > 5 ? 9 : 0, description: 'Contador numérico. Se maior que 5 (w7), contribui com 9 pontos.' },
      { name: 'Data Recente', value: (dateNow - new Date(formValues.date).getTime()) / (1000 * 60 * 60 * 24) < 7 ? 14 : 0, description: 'Data de referência (YYYY-MM-DD). Se for nos últimos 7 dias (w8), contribui com 14 pontos.' },
    ];

    return breakdownValues.map((item, index) => {
      const widthPercentage = (item.value / maxScore) * 100;
      return (
        <div key={index} className="flex items-center gap-3 group relative">
          <span className="text-sm text-gray-300 w-48">{item.name}:</span>
          <div className="relative flex-grow bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${widthPercentage}%` }}
            ></div>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-100">
                {item.value}
            </span>
          </div>

          {/* Tooltip com a descrição */}
          {item.description && ( // Renderiza apenas se houver uma descrição
            <div className="
              absolute left-1/2 transform -translate-x-1/2 -top-10
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              bg-gray-700 text-white text-xs rounded py-1 px-2 pointer-events-none
              transition-all duration-300 z-10 w-max
            ">
              {item.description}
              <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-700"></div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Resultado da Análise</h2>

      <div id="results-display" className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-300">Score Final:</span>
          <span id="final-score" className="text-4xl font-extrabold text-blue-500">
            {analysisResult.score}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-300">Nível de Risco:</span>
          <span
            id="level-display"
            className={`px-4 py-2 rounded-full text-xl font-bold ${getLevelColorClass(analysisResult.level)}`}
          >
            {analysisResult.level}
          </span>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Detalhamento dos Fatores:</h3>
          <div id="factors-breakdown" className="space-y-3">
            {renderBreakdownBars()}
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Fatores Detectados:</h3>
          <div id="detected-factors-list" className="flex flex-wrap gap-2">
            {analysisResult.factors.length > 0 ? (
              analysisResult.factors.map((factor, index) => (
                <span key={index} className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {factor}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Nenhum fator detectado.</span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <Button
            onClick={handleReset}
            className="py-2 px-4 bg-gray-700 text-gray-100 font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Reiniciar Teste
          </Button>
          <Button
            onClick={handleCopyData}
            className="py-2 px-4 bg-gray-700 text-gray-100 font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Copiar Dados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
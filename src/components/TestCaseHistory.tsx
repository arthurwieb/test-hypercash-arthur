// src/components/analysis/TestCaseHistory.tsx
"use client"; // Marca este componente como um Client Component

import { Button } from '@mantine/core';

// Importar interfaces e schemas de arquivos separados
import { analyzeSomething } from '@/lib/analysisLogic'; // Precisamos desta função para analisar itens do histórico
import { AnalysisResult, InputData } from '@/types';

// Define as props que o TestCaseHistory irá receber
interface TestCaseHistoryProps {
  testCases: { name: string; data: InputData; expected: AnalysisResult['level'] }[];
  history: InputData[];
  loadTestCase: (caseData: InputData) => void;
  getLevelColorClass: (level: AnalysisResult['level']) => string;
  setFormValues: (values: InputData) => void; // Para recarregar dados do histórico no formulário principal
}

const TestCaseHistory = ({
  testCases,
  history,
  loadTestCase,
  getLevelColorClass,
  setFormValues,
}: TestCaseHistoryProps) => {
  return (
    <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mt-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Casos de Teste e Histórico</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Casos de Teste Pré-definidos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Carregar Casos de Teste:</h3>
          <div id="predefined-tests" className="flex flex-wrap gap-3">
            {testCases.map((testCase, index) => (
              <Button
                key={index}
                onClick={() => loadTestCase(testCase.data)}
                className={`py-2 px-4 font-medium rounded-lg hover:opacity-80 transition duration-200 ${
                  getLevelColorClass(testCase.expected)
                }`}
              >
                {testCase.name} ({testCase.expected})
              </Button>
            ))}
          </div>
        </div>

        {/* Histórico de Testes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Histórico de Testes:</h3>
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            <ul id="history-list" className="space-y-2">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <li key={index} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center border border-gray-600">
                    <span className="text-gray-200">
                      Score: {analyzeSomething(item).score}, Nível: {analyzeSomething(item).level}
                    </span>
                    <Button
                      onClick={() => setFormValues(item)} // Usa setFormValues para recarregar no formulário principal
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Recarregar
                    </Button>
                  </li>
                ))
              ) : (
                <p id="no-history-message" className="text-gray-400 text-sm mt-2">Nenhum teste no histórico ainda.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseHistory;
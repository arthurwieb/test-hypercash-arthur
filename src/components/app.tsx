"use client"; // Marca este componente como um Client Component

import { useForm, zodResolver } from '@mantine/form';
import { useEffect, useState } from 'react';
import { z } from 'zod';

// Importar componentes menores
import InputForm from './InputForm';
import ResultsDisplay from './ResultsDisplay';
import TestCaseHistory from './TestCaseHistory'; // Importa o novo componente de histórico

// Importar interfaces e schemas de arquivos separados
import { analyzeSomething } from '@/lib/analysisLogic';
import { testCases } from '@/lib/constants';
import { inputDataSchema } from '@/schemas/inputDataSchema';
import { AnalysisResult, InputData } from '@/types';

// O tipo inferido do schema Zod para uso com useForm
type InputDataForm = z.infer<typeof inputDataSchema>;

const AnalysisApp = () => {
  // Configuração do formulário Mantine com Zod Resolver
  const form = useForm<InputDataForm>({
    initialValues: {
      val: 0,
      flag1: true,
      text: "",
      hour: 0,
      email: "",
      addr1: "",
      addr2: "",
      count: 0,
      date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    },
    validate: zodResolver(inputDataSchema),
  });

  // Estado para os resultados da análise
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    score: 0,
    level: '--',
    factors: [],
  });

  // Estado para o histórico de testes
  const [history, setHistory] = useState<InputData[]>([]);

  // Efeito para carregar o histórico do localStorage APENAS no lado do cliente após a montagem
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Falha ao carregar histórico do localStorage", e);
    }
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  useEffect(() => {
    const currentValues = form.values;
    const validationResult = inputDataSchema.safeParse(currentValues);

    if (validationResult.success) {
      const result = analyzeSomething(validationResult.data);
      setAnalysisResult(result);
    } else {
      setAnalysisResult({ score: 0, level: '--', factors: [] });
    }
  }, [form.values]);

  useEffect(() => {
    try {
      localStorage.setItem('analysisHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Falha ao salvar histórico no localStorage", e);
    }
  }, [history]);

  const handleSubmit = (values: InputDataForm) => {
    const result = analyzeSomething(values);
    setAnalysisResult(result);
    setHistory(prevHistory => {
      const newHistory = [values, ...prevHistory.slice(0, 4)]; // Mantém os últimos 5
      return newHistory;
    });
  };

  const loadTestCase = (caseData: InputData) => {
    form.setValues(caseData); // Define os valores do formulário Mantine
  };

  // Handler para resetar o formulário
  const handleReset = () => {
    form.reset(); // Reseta o formulário para os initialValues
    setAnalysisResult({ score: 0, level: '--', factors: [] });
  };

  // Handler para copiar os dados de input
  const handleCopyData = () => {
    const dataToCopy = JSON.stringify(form.values, null, 2); // Copia os valores atuais do formulário
    document.execCommand('copy');
    alert('Dados copiados para a área de transferência!'); // Em produção, use um modal ou toast
  };

  // Função para obter a classe de cor do nível (mantida aqui pois é usada por ResultsDisplay e TestCaseHistory)
  const getLevelColorClass = (level: AnalysisResult['level']) => {
    switch (level) {
      case 'GREEN': return 'bg-emerald-500 text-white';
      case 'YELLOW': return 'bg-amber-500 text-white';
      case 'RED': return 'bg-red-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">

        {/* Componente do Formulário de Teste */}
        <InputForm
          form={form}
          onSubmit={handleSubmit}
        />

        {/* Componente de Visualização de Resultados */}
        <ResultsDisplay
          analysisResult={analysisResult}
          formValues={form.values} // Passa os valores do formulário
          getLevelColorClass={getLevelColorClass}
          handleReset={handleReset}
          handleCopyData={handleCopyData}
        />

        {/* Componente de Casos de Teste e Histórico */}
        <TestCaseHistory
          testCases={testCases}
          history={history}
          loadTestCase={loadTestCase}
          getLevelColorClass={getLevelColorClass}
          setFormValues={form.setValues} // Passa o setValues do form para recarregar histórico
        />

      </div>
    </div>
  );
};

export default AnalysisApp;

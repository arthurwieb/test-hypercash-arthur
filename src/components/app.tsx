"use client"; // Marca este componente como um Client Component

import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { z } from 'zod';

// Importar componentes menores
import InputForm from './InputForm';
import ResultsDisplay from './ResultsDisplay';
import TestCaseHistory from './TestCaseHistory';

// Importar interfaces e schemas de arquivos separados
import { analyzeSomething } from '@/lib/analysisLogic';
import { testCases } from '@/lib/constants';
import { inputDataSchema } from '@/schemas/inputDataSchema';
import { AnalysisResult, InputData } from '@/types';
import { zod4Resolver } from 'mantine-form-zod-resolver';

// O tipo inferido do schema Zod para uso com useForm
type InputDataForm = z.infer<typeof inputDataSchema>;

const AnalysisApp = () => {
  // Configuração do formulário Mantine com Zod Resolver
  const form = useForm<InputDataForm>({
    initialValues: {
      val: 0,
      flag1: false,
      text: "",
      hour: 0,
      email: "",
      addr1: "",
      addr2: "",
      count: 0,
      date: new Date(),
    },
    validate: zod4Resolver(inputDataSchema),
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
        // CORREÇÃO: Converte strings de data de volta para objetos Date ao carregar
        const parsedHistory: InputData[] = JSON.parse(storedHistory).map((item: InputData) => ({
          ...item,
          date: new Date(item.date), // Converte a string ISO de volta para Date
        }));
        setHistory(parsedHistory);
      }
    } catch (e) {
      console.error("Falha ao carregar histórico do localStorage", e);
    }
  }, []);

  // Efeito para recalcular a análise sempre que os valores do formulário mudam (em tempo real)
  // useEffect(() => {
  //   const currentValues = form.values;
  //   const validationResult = inputDataSchema.safeParse(currentValues);

  //   if (validationResult.success) {
  //     const result = analyzeSomething(validationResult.data);
  //     setAnalysisResult(result);
  //   } else {
  //     setAnalysisResult({ score: 0, level: '--', factors: [] });
  //   }
  // }, [form.values]);

  // Efeito para salvar o histórico no localStorage sempre que o histórico muda
  useEffect(() => {
    try {
      const historyToStore = history.map(item => ({
        ...item,
        date: item.date.toISOString(),
      }));
      localStorage.setItem('analysisHistory', JSON.stringify(historyToStore));
    } catch (e) {
      console.error("Falha ao salvar histórico no localStorage", e);
    }
  }, [history]);

  const [submittedFormValues, setSubmittedFormValues] = useState<InputDataForm>(form.values);

  const handleSubmit = (values: InputDataForm) => {
    const result = analyzeSomething(values);
    setAnalysisResult(result);
    setSubmittedFormValues(values);
    setHistory(prevHistory => {
      const newHistory = [values, ...prevHistory.slice(0, 4)]; // Mantém os últimos 5
      return newHistory;
    });
  };

  // Handler para carregar um caso de teste pré-definido
  const loadTestCase = (caseData: InputData) => {
    // caseData.date já deve ser um objeto Date vindo de constants.ts
    form.setValues(caseData);
  };

  // Handler para resetar o formulário
  const handleReset = () => {
    form.reset(); // Reseta o formulário para os initialValues
    setAnalysisResult({ score: 0, level: '--', factors: [] });
    setSubmittedFormValues(form.getInitialValues());

  };

  // Handler para copiar os dados de input
  const handleCopyData = () => {
    // CORREÇÃO: Converte Date para string ISO para copiar
    const dataToCopy = JSON.stringify({
      ...form.values,
      date: form.values.date.toISOString().split('T')[0], // Formato YYYY-MM-DD para copiar
    }, null, 2);
    document.execCommand('copy');
    alert('Dados copiados para a área de transferência!');
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">

        {/* Componente do Formulário de Teste */}
        <InputForm
          form={form}
          onSubmit={handleSubmit}
        />

        {/* Componente de Visualização de Resultados */}
        <ResultsDisplay
          analysisResult={analysisResult}
          formValues={submittedFormValues} // Passa os valores do formulário
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

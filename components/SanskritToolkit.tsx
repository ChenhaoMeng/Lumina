import React, { useState, useEffect, useCallback } from 'react';
import { 
  enhancedSanskritService, 
  TransliterationResult, 
  SegmentationResult, 
  LookupResult, 
  SchemeDetectionResult,
  GenerationResult,
  PipelineResult,
  TransliterationScheme,
  SchemeInfo
} from '../services/enhancedSanskritService';
import { Loader2, RefreshCw, Copy, Check, BookOpen, Search, FileText, Type, Braces, Sparkles, AlertCircle, Info } from 'lucide-react';

interface SanskritToolkitProps {
  initialText?: string;
  onClose?: () => void;
  className?: string;
}

type ActiveTab = 'dictionary' | 'other';
type OtherSubTab = 'generate' | 'detect' | 'pipeline' | 'schemes';

export const SanskritToolkit: React.FC<SanskritToolkitProps> = ({
  initialText = '',
  onClose,
  className = '',
}) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<ActiveTab>('dictionary');
  const [activeOtherTab, setActiveOtherTab] = useState<OtherSubTab>('generate');
  const [inputText, setInputText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 转写状态
  const [fromScheme, setFromScheme] = useState<TransliterationScheme>('devanagari');
  const [toScheme, setToScheme] = useState<TransliterationScheme>('iast');
  const [transliterationResult, setTransliterationResult] = useState<TransliterationResult | null>(null);

  // 分词状态
  const [segmentationResult, setSegmentationResult] = useState<SegmentationResult | null>(null);

  // 词典查询状态
  const [lookupScheme, setLookupScheme] = useState<TransliterationScheme>('slp1');
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);

  // 方案检测状态
  const [detectionResult, setDetectionResult] = useState<SchemeDetectionResult | null>(null);

  // 词形生成状态
  const [dhatu, setDhatu] = useState('');
  const [gana, setGana] = useState('bhvadi');
  const [lakara, setLakara] = useState('lat');
  const [prayoga, setPrayoga] = useState('kartari');
  const [purusha, setPurusha] = useState('prathama');
  const [vacana, setVacana] = useState('eka');
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);

  // 处理管道状态
  const [pipelineTargetScheme, setPipelineTargetScheme] = useState<TransliterationScheme>('slp1');
  const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null);

  // 词典分析状态
  const [dictionaryTargetScheme, setDictionaryTargetScheme] = useState<TransliterationScheme>('iast');
  const [dictionaryAnalysisResult, setDictionaryAnalysisResult] = useState<PipelineResult | null>(null);

  // 支持的方案列表
  const [supportedSchemes, setSupportedSchemes] = useState<SchemeInfo[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(false);

  // 健康状态
  const [serviceHealthy, setServiceHealthy] = useState<boolean>(false);
  const [healthCheckLoading, setHealthCheckLoading] = useState(false);

  // 初始化：获取支持的方案并检查服务健康
  useEffect(() => {
    checkServiceHealth();
    loadSupportedSchemes();
  }, []);

  const checkServiceHealth = async () => {
    setHealthCheckLoading(true);
    try {
      const health = await enhancedSanskritService.healthCheck();
      setServiceHealthy(health.initialized);
    } catch (err) {
      console.error('服务健康检查失败:', err);
      setServiceHealthy(false);
    } finally {
      setHealthCheckLoading(false);
    }
  };

  const loadSupportedSchemes = async () => {
    setSchemesLoading(true);
    try {
      const result = await enhancedSanskritService.getSupportedSchemes();
      if (result.success) {
        setSupportedSchemes(result.schemes);
      }
    } catch (err) {
      console.error('加载方案列表失败:', err);
    } finally {
      setSchemesLoading(false);
    }
  };

  // 处理文本变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setError(null);
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 转写功能
  const handleTransliterate = async () => {
    if (!inputText.trim()) {
      setError('请输入要转写的文本');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await enhancedSanskritService.transliterate(inputText, fromScheme, toScheme);
      setTransliterationResult(result);
      if (!result.success) {
        setError(result.error || '转写失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '转写过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 分词功能
  const handleSegment = async () => {
    if (!inputText.trim()) {
      setError('请输入要分词的文本');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await enhancedSanskritService.segment(inputText);
      setSegmentationResult(result);
      if (!result.success) {
        setError(result.error || '分词失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分词过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 词典查询功能
  const handleLookup = async () => {
    if (!inputText.trim()) {
      setError('请输入要查询的单词');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await enhancedSanskritService.lookup(inputText, lookupScheme);
      setLookupResult(result);
      if (!result.success) {
        setError(result.error || '词典查询失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '词典查询过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 方案检测功能
  const handleDetect = async () => {
    if (!inputText.trim()) {
      setError('请输入要检测的文本');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await enhancedSanskritService.detectScheme(inputText);
      setDetectionResult(result);
      if (!result.success) {
        setError(result.error || '方案检测失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '方案检测过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 词形生成功能
  const handleGenerate = async () => {
    if (!dhatu.trim()) {
      setError('请输入词根 (dhatu)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await enhancedSanskritService.generateForms(
        dhatu,
        gana,
        lakara,
        prayoga,
        purusha,
        vacana
      );
      setGenerationResult(result);
      if (!result.success) {
        setError(result.error || '词形生成失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '词形生成过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 词典分析功能
  const handleDictionaryAnalysis = async () => {
    if (!inputText.trim()) {
      setError('请输入要分析的文本');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await enhancedSanskritService.processPipeline(inputText, dictionaryTargetScheme);
      setDictionaryAnalysisResult(result);
      if (!result.success) {
        setError(result.error || '词典分析失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 处理管道功能
  const handlePipeline = async () => {
    if (!inputText.trim()) {
      setError('请输入要处理的文本');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await enhancedSanskritService.processPipeline(inputText, pipelineTargetScheme);
      setPipelineResult(result);
      if (!result.success) {
        setError(result.error || '处理管道失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 渲染服务健康状态
  const renderServiceStatus = () => {
    if (healthCheckLoading) {
      return (
        <div className="flex items-center gap-2 text-amber-500">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs">检查服务状态...</span>
        </div>
      );
    }

    if (serviceHealthy) {
      return (
        <div className="flex items-center gap-2 text-emerald-500">
          <Check size={14} />
          <span className="text-xs">服务在线</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-rose-500">
        <AlertCircle size={14} />
        <span className="text-xs">服务离线</span>
      </div>
    );
  };

  // 渲染选项卡按钮
  const renderTabButton = (tab: ActiveTab, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === tab
          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  // 渲染转写界面
  const renderTransliterationTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">源方案</label>
          <select
            value={fromScheme}
            onChange={(e) => setFromScheme(e.target.value as TransliterationScheme)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {supportedSchemes.map((scheme) => (
              <option key={scheme.name} value={scheme.name}>
                {scheme.display_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">目标方案</label>
          <select
            value={toScheme}
            onChange={(e) => setToScheme(e.target.value as TransliterationScheme)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {supportedSchemes.map((scheme) => (
              <option key={scheme.name} value={scheme.name}>
                {scheme.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleTransliterate}
        disabled={loading || !serviceHealthy}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Type size={20} />}
        转写
      </button>

      {transliterationResult && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-800">转写结果</h4>
            <button
              onClick={() => copyToClipboard(transliterationResult.transliterated)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>

          {transliterationResult.success ? (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-slate-500 mb-1">原始文本 ({transliterationResult.from_scheme})</div>
                <div className="text-lg font-mono">{transliterationResult.original}</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="text-sm text-emerald-600 mb-1">转写结果 ({transliterationResult.to_scheme})</div>
                <div className="text-lg font-mono text-emerald-700">{transliterationResult.transliterated}</div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>转写失败: {transliterationResult.error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染分词界面
  const renderSegmentationTab = () => (
    <div className="space-y-4">
      <button
        onClick={handleSegment}
        disabled={loading || !serviceHealthy}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
        分词
      </button>

      {segmentationResult && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-slate-800">分词结果</h4>

          {segmentationResult.success ? (
            <div className="space-y-3">
              <div className="text-sm text-slate-500">
                共 {segmentationResult.segment_count} 个分词，处理时间 {segmentationResult.processing_time_ms}ms
              </div>
              
              <div className="space-y-2">
                {segmentationResult.segments.map((segment, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-lg text-slate-800">{segment.text}</div>
                        {segment.lemma && (
                          <div className="text-sm text-slate-600 mt-1">词根: {segment.lemma}</div>
                        )}
                      </div>
                      <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                    {segment.info && (
                      <div className="mt-2 text-sm text-slate-500 bg-slate-50 p-2 rounded">
                        {segment.info}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>分词失败: {segmentationResult.error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染词典查询界面
  const renderLookupTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">查询方案</label>
        <select
          value={lookupScheme}
          onChange={(e) => setLookupScheme(e.target.value as TransliterationScheme)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {supportedSchemes.map((scheme) => (
            <option key={scheme.name} value={scheme.name}>
              {scheme.display_name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleLookup}
        disabled={loading || !serviceHealthy}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        查询词典
      </button>

      {lookupResult && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-slate-800">词典查询结果</h4>

          {lookupResult.success ? (
            <div className="space-y-3">
              <div className="text-sm text-slate-500">
                查询词: {lookupResult.word}
                {lookupResult.lookup_word && lookupResult.lookup_word !== lookupResult.word && (
                  <> → 内部词: {lookupResult.lookup_word}</>
                )}
                ，找到 {lookupResult.entry_count} 个条目
                {lookupResult.primary_meaning && (
                  <div className="mt-1 text-purple-700 font-medium">
                    主要词义: {lookupResult.primary_meaning}
                  </div>
                )}
                {lookupResult.sources && (
                  <div className="mt-1">
                    来源: 
                    {lookupResult.sources.kosha && <span className="ml-1 text-green-600">Kosha</span>}
                    {lookupResult.sources.kosha && lookupResult.sources.local_db && <span className="text-slate-400">, </span>}
                    {lookupResult.sources.local_db && <span className="ml-1 text-blue-600">本地词典</span>}
                  </div>
                )}
                <div className="text-xs text-slate-400 mt-1">
                  处理时间 {lookupResult.processing_time_ms}ms
                </div>
              </div>
              
              {lookupResult.entries.length > 0 ? (
                <div className="space-y-3">
                  {lookupResult.entries.map((entry, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          {entry.source === 'local_db' ? (
                            <>
                              <div className="font-semibold text-slate-800">{entry.word}</div>
                              <div className="text-sm text-slate-500">{entry.pos}</div>
                            </>
                          ) : (
                            <>
                              <div className="font-semibold text-slate-800">{entry.lemma}</div>
                              <div className="text-sm text-slate-500">{entry.type}</div>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {entry.source === 'local_db' ? '本地词典' : 'Kosha'}
                          </span>
                          <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            条目 {index + 1}
                          </span>
                        </div>
                      </div>
                      
                      {/* 本地词典数据显示 */}
                      {entry.source === 'local_db' ? (
                        <div className="space-y-3">
                          {entry.normalized_word && entry.normalized_word !== entry.word && (
                            <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                              <span className="text-slate-500">词根:</span> {entry.normalized_word}
                            </div>
                          )}
                          {entry.etymology && (
                            <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                              <span className="text-slate-500">词源:</span> {entry.etymology}
                            </div>
                          )}
                          {entry.pronunciation && (
                            <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                              <span className="text-slate-500">发音:</span> {entry.pronunciation}
                            </div>
                          )}
                          {entry.senses && entry.senses.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-slate-700">词义:</div>
                              {entry.senses.map((sense: any, sIdx: number) => (
                                <div key={sIdx} className="ml-2 border-l-2 border-purple-300 pl-3">
                                  <div className="text-sm text-slate-700">{sense.gloss}</div>
                                  {sense.example && (
                                    <div className="text-xs text-slate-500 italic mt-1">
                                      例: {sense.example}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {entry.forms && entry.forms.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-slate-700">词形变化:</div>
                              <div className="flex flex-wrap gap-1">
                                {entry.forms.slice(0, 10).map((form: any, fIdx: number) => (
                                  <span key={fIdx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                    {form.form} {form.tags && `(${form.tags})`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Kosha 数据显示 */
                        <>
                          <div className="text-sm text-slate-700 font-mono mb-2">{entry.string}</div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {entry.linga && (
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500">性别:</span> {entry.linga}
                              </div>
                            )}
                            {entry.vacana && (
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500">数:</span> {entry.vacana}
                              </div>
                            )}
                            {entry.vibhakti && (
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500">格:</span> {entry.vibhakti}
                              </div>
                            )}
                            {entry.is_avyaya !== undefined && (
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-slate-500">不变词:</span> {entry.is_avyaya ? '是' : '否'}
                              </div>
                            )}
                          </div>
                          
                          {entry.pratipadika_entry && (
                            <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                              <span className="font-medium">词干条目:</span> {entry.pratipadika_entry}
                            </div>
                          )}
                          {entry.artha && (
                            <div className="mt-2 text-sm text-purple-700 bg-purple-50 p-2 rounded">
                              <span className="font-medium">词义:</span> {entry.artha}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Info size={18} />
                    <span>未找到词典条目</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>词典查询失败: {lookupResult.error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染方案检测界面
  const renderDetectionTab = () => (
    <div className="space-y-4">
      <button
        onClick={handleDetect}
        disabled={loading || !serviceHealthy}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Braces size={20} />}
        检测方案
      </button>

      {detectionResult && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-slate-800">方案检测结果</h4>

          {detectionResult.success ? (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-slate-500 mb-1">检测文本</div>
                <div className="text-lg font-mono">{detectionResult.text}</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600 mb-1">检测到的方案</div>
                <div className="text-lg font-semibold text-purple-700">
                  {supportedSchemes.find(s => s.name === detectionResult.scheme)?.display_name || detectionResult.scheme}
                </div>
                <div className="text-sm text-purple-500 mt-1">枚举值: {detectionResult.scheme_enum}</div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>方案检测失败: {detectionResult.error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染词形生成界面
  const renderGenerationTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">词根 (Dhatu)</label>
          <input
            type="text"
            value={dhatu}
            onChange={(e) => setDhatu(e.target.value)}
            placeholder="例如: Bav"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">词根组 (Gana)</label>
          <select
            value={gana}
            onChange={(e) => setGana(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="bhvadi">भ्वादि (Bhvadi)</option>
            <option value="adadi">अदादि (Adadi)</option>
            <option value="juhotyadi">जुहोत्यादि (Juhotyadi)</option>
            <option value="divadi">दिवादि (Divadi)</option>
            <option value="svadi">स्वादि (Svadi)</option>
            <option value="tudadi">तुदादि (Tudadi)</option>
            <option value="rudhadi">रुधादि (Rudhadi)</option>
            <option value="tanadi">तनादि (Tanadi)</option>
            <option value="kryadi">क्र्यादि (Kryadi)</option>
            <option value="curadi">चुरादि (Curadi)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">时态 (Lakara)</label>
          <select
            value={lakara}
            onChange={(e) => setLakara(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="lat">लट् (Present)</option>
            <option value="lit">लिट् (Perfect)</option>
            <option value="lut">लुट् (Future)</option>
            <option value="lrt">लृट् (Simple Future)</option>
            <option value="lot">लोट् (Imperative)</option>
            <option value="lan">लङ् (Imperfect)</option>
            <option value="vidhilin">विधिलिङ् (Optative)</option>
            <option value="ashirlin">आशीर्लिङ् (Benedictive)</option>
            <option value="lun">लुङ् (Aorist)</option>
            <option value="lrn">लृङ् (Conditional)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">语态 (Prayoga)</label>
          <select
            value={prayoga}
            onChange={(e) => setPrayoga(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="kartari">कर्तरि (Active)</option>
            <option value="karmani">कर्मणि (Passive)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">人称 (Purusha)</label>
          <select
            value={purusha}
            onChange={(e) => setPurusha(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="prathama">प्रथम (First)</option>
            <option value="madhyama">मध्यम (Second)</option>
            <option value="uttama">उत्तम (Third)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">数 (Vacana)</label>
          <select
            value={vacana}
            onChange={(e) => setVacana(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="eka">एक (Singular)</option>
            <option value="dvi">द्वि (Dual)</option>
            <option value="bahu">बहु (Plural)</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !serviceHealthy}
        className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
        生成词形
      </button>

      {generationResult && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-slate-800">词形生成结果</h4>

          {generationResult.success ? (
            <div className="space-y-3">
              <div className="text-sm text-slate-500">
                参数: {generationResult.dhatu} ({generationResult.gana}), {generationResult.lakara}, {generationResult.prayoga}, {generationResult.purusha} {generationResult.vacana}
              </div>
              
              {generationResult.forms.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-slate-600">
                    生成 {generationResult.form_count} 个词形，处理时间 {generationResult.processing_time_ms}ms
                  </div>
                  
                  {generationResult.forms.map((form, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="font-mono text-lg text-slate-800">{form.text}</div>
                        <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded">
                          词形 {index + 1}
                        </span>
                      </div>
                      
                      {form.history.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-slate-700">生成过程:</div>
                          <div className="space-y-1">
                            {form.history.map((step, stepIndex) => (
                              <div key={stepIndex} className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                <div className="font-mono text-xs text-slate-500">{step.rule}</div>
                                <div className="mt-1">→ {step.result}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Info size={18} />
                    <span>未生成词形</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>词形生成失败: {generationResult.error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染处理管道界面
  const renderPipelineTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">目标方案 (内部处理)</label>
        <select
          value={pipelineTargetScheme}
          onChange={(e) => setPipelineTargetScheme(e.target.value as TransliterationScheme)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {supportedSchemes.map((scheme) => (
            <option key={scheme.name} value={scheme.name}>
              {scheme.display_name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePipeline}
        disabled={loading || !serviceHealthy}
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
        完整处理
      </button>

      {pipelineResult && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-slate-800">处理管道结果</h4>

          {pipelineResult.success ? (
            <div className="space-y-4">
              <div className="text-sm text-slate-500">
                处理时间: {pipelineResult.processing_time_ms}ms
              </div>
              
              {/* 输入信息 */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-medium text-slate-700 mb-2">输入信息</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-slate-500">文本</div>
                    <div className="font-mono">{pipelineResult.pipeline.input.text}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">检测方案</div>
                    <div className="font-medium">{pipelineResult.pipeline.input.scheme}</div>
                  </div>
                </div>
              </div>
              
              {/* 归一化信息 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-700 mb-2">归一化</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-blue-600">目标方案</div>
                    <div className="font-medium">{pipelineResult.pipeline.normalization.target_scheme}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600">归一化文本</div>
                    <div className="font-mono">{pipelineResult.pipeline.normalization.normalized_text}</div>
                  </div>
                </div>
              </div>
              
              {/* 分词结果 */}
              {pipelineResult.pipeline.segmentation.success && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h5 className="font-medium text-emerald-700 mb-2">
                    分词结果 ({pipelineResult.pipeline.segmentation.segment_count} 个分词)
                  </h5>
                  <div className="space-y-2">
                    {pipelineResult.pipeline.segmentation.segments.map((segment, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-emerald-100">
                        <div className="flex items-center justify-between">
                          <div className="font-mono">{segment.text}</div>
                          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>
                        {segment.lemma && (
                          <div className="text-sm text-slate-600 mt-1">词根: {segment.lemma}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 词典查询结果 */}
              {pipelineResult.pipeline.lookup.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h5 className="font-medium text-purple-700 mb-2">词典查询</h5>
                  <div className="space-y-3">
                    {pipelineResult.pipeline.lookup.map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-mono font-medium">{item.segment.text}</div>
                            {item.segment.lemma && (
                              <div className="text-sm text-slate-600">词根: {item.segment.lemma}</div>
                            )}
                          </div>
                          <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            条目 {index + 1}
                          </span>
                        </div>
                        
                        {item.lookup.success && item.lookup.entries.length > 0 ? (
                          <div className="text-sm text-slate-600">
                            找到 {item.lookup.entry_count} 个词典条目
                          </div>
                        ) : (
                          <div className="text-sm text-amber-600">
                            未找到词典条目
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>处理管道失败: {pipelineResult.error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染方案列表界面
  const renderSchemesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-800">支持的转写方案</h4>
        <button
          onClick={loadSupportedSchemes}
          disabled={schemesLoading}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          {schemesLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          刷新
        </button>
      </div>

      {schemesLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-indigo-500" />
        </div>
      ) : supportedSchemes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {supportedSchemes.map((scheme) => (
            <div
              key={scheme.name}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="font-medium text-slate-800">{scheme.display_name}</div>
              <div className="text-sm text-slate-500 mt-1">标识符: {scheme.name}</div>
              <div className="text-xs text-slate-400 mt-1 font-mono">{scheme.enum}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>无法加载方案列表</span>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染词典视图
  const renderDictionaryView = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">目标转写方案 (用于显示)</label>
          <select
            value={dictionaryTargetScheme}
            onChange={(e) => setDictionaryTargetScheme(e.target.value as TransliterationScheme)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {supportedSchemes.map((scheme) => (
              <option key={scheme.name} value={scheme.name}>
                {scheme.display_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">选择转写方案用于显示分词和词义结果</p>
        </div>

        <button
          onClick={handleDictionaryAnalysis}
          disabled={loading || !serviceHealthy}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          分析文本
        </button>
      </div>

      {dictionaryAnalysisResult && (
        <div className="space-y-6">
          {dictionaryAnalysisResult.success ? (
            <>
              {/* 转写后文本 */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">转写后文本</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">原始文本 ({dictionaryAnalysisResult.pipeline.input.scheme})</div>
                    <div className="font-mono text-lg p-3 bg-slate-50 rounded">{dictionaryAnalysisResult.pipeline.input.text}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">转写文本 ({dictionaryAnalysisResult.pipeline.normalization.target_scheme})</div>
                    <div className="font-mono text-lg p-3 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                      {dictionaryAnalysisResult.pipeline.normalization.normalized_text}
                    </div>
                  </div>
                </div>
              </div>

              {/* 分词展示 */}
              {dictionaryAnalysisResult.pipeline.segmentation.success && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-slate-800 mb-3">分词结果</h4>
                  <div className="text-sm text-slate-500 mb-2">
                    共 {dictionaryAnalysisResult.pipeline.segmentation.segment_count} 个分词
                  </div>
                  
                  <div className="space-y-3">
                    {dictionaryAnalysisResult.pipeline.segmentation.segments.map((segment, index) => {
                      const lookupItem = dictionaryAnalysisResult.pipeline.lookup[index];
                      console.log('DEBUG lookupItem:', index, lookupItem);
                      return (
                        <div key={index} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-mono text-lg text-slate-800">{segment.text}</div>
                              {segment.lemma && (
                                <div className="text-sm text-slate-600 mt-1">词根: {segment.lemma}</div>
                              )}
                            </div>
                            <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                              分词 {index + 1}
                            </span>
                          </div>

                          {/* 词义展示和语法分析 */}
                          {lookupItem && lookupItem.lookup && lookupItem.lookup.success && lookupItem.lookup.entries && lookupItem.lookup.entries.length > 0 ? (
                            <div className="mt-4 space-y-3">
                              <h5 className="font-medium text-slate-700">词义与语法分析</h5>
                              <div className="space-y-2">
                                {lookupItem.lookup.entries.slice(0, 3).map((entry: any, entryIndex: number) => (
                                  <div key={entryIndex} className="bg-slate-50 rounded-lg p-3">
                                    {/* 本地词典数据显示 */}
                                    {entry.source === 'local_db' ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="font-semibold text-slate-800">{entry.word}</span>
                                          {entry.partOfSpeech && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{entry.partOfSpeech}</span>
                                          )}
                                        </div>
                                        {entry.definitions && entry.definitions.length > 0 && (
                                          <div className="space-y-1">
                                            {entry.definitions.map((def: string, dIdx: number) => (
                                              <div key={dIdx} className="text-sm text-slate-700 pl-2 border-l-2 border-purple-300">
                                                {def}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                        {entry.etymology && (
                                          <div className="text-xs text-slate-500 mt-1">
                                            <span className="font-medium">词源:</span> {entry.etymology}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                    /* Kosha 数据显示 */
                                    <>
                                      <div className="text-sm font-mono text-slate-800 mb-1">{entry.string}</div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                      {entry.linga && (
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                          <span className="text-slate-500">性别:</span> {entry.linga}
                                        </div>
                                      )}
                                      {entry.vacana && (
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                          <span className="text-slate-500">数:</span> {entry.vacana}
                                        </div>
                                      )}
                                      {entry.vibhakti && (
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                          <span className="text-slate-500">格:</span> {entry.vibhakti}
                                        </div>
                                      )}
                                      {entry.is_avyaya !== undefined && (
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                          <span className="text-slate-500">不变词:</span> {entry.is_avyaya ? '是' : '否'}
                                        </div>
                                      )}
                                      </div>
                                      {entry.pratipadika_entry && (
                                        <div className="mt-2 text-xs text-slate-500">
                                          <span className="font-medium">词干条目:</span> {entry.pratipadika_entry}
                                        </div>
                                      )}
                                    </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4 bg-amber-50 text-amber-700 p-3 rounded-lg border border-amber-200">
                              <div className="flex items-center gap-2">
                                <Info size={16} />
                                <span className="text-sm">未找到该分词的词典条目</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>分析失败: {dictionaryAnalysisResult.error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 渲染其他功能视图
  const renderOtherFunctionsView = () => (
    <div className="space-y-6">
      {/* 子选项卡导航 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveOtherTab('generate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeOtherTab === 'generate'
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles size={16} />
          词形生成
        </button>
        <button
          type="button"
          onClick={() => setActiveOtherTab('detect')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeOtherTab === 'detect'
              ? 'bg-purple-100 text-purple-700 border border-purple-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Braces size={16} />
          方案检测
        </button>
        <button
          type="button"
          onClick={() => setActiveOtherTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeOtherTab === 'pipeline'
              ? 'bg-cyan-100 text-cyan-700 border border-cyan-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText size={16} />
          完整处理
        </button>
        <button
          type="button"
          onClick={() => setActiveOtherTab('schemes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeOtherTab === 'schemes'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BookOpen size={16} />
          方案列表
        </button>
      </div>

      {/* 子选项卡内容 */}
      <div className="mt-4">
        {activeOtherTab === 'generate' && renderGenerationTab()}
        {activeOtherTab === 'detect' && renderDetectionTab()}
        {activeOtherTab === 'pipeline' && renderPipelineTab()}
        {activeOtherTab === 'schemes' && renderSchemesTab()}
      </div>
    </div>
  );

  // 渲染活动标签内容
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dictionary':
        return renderDictionaryView();
      case 'other':
        return renderOtherFunctionsView();
      default:
        return renderDictionaryView();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ${className}`}>
      {/* 头部 */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">梵语工具集</h3>
            <p className="text-sm text-slate-500 mt-1">专业梵语处理工具，基于 vidyut 库</p>
          </div>
          <div className="flex items-center gap-3">
            {renderServiceStatus()}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                title="关闭"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">输入文本</label>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="输入梵语文本（天城文、IAST、SLP1等格式）"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-y font-mono"
            rows={3}
          />
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="mb-4 bg-rose-50 text-rose-700 p-4 rounded-lg border border-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 选项卡导航 */}
        <div className="flex flex-wrap gap-2">
          {renderTabButton('dictionary', '词典视图', <BookOpen size={16} />)}
          {renderTabButton('other', '其他功能', <Sparkles size={16} />)}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {renderActiveTabContent()}
      </div>

      {/* 脚注 */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <div className="text-xs text-slate-500 text-center">
          梵语工具集使用 <a href="https://github.com/sanskrit/sanskrit" className="text-indigo-500 hover:text-indigo-700">vidyut</a> 库，
          运行在 <code className="text-slate-600">localhost:3008</code> 端口
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { SplitQueryResult, SplitPartResult } from '../services/sanskritDictionaryService';

interface SanskritSplitDisplayProps {
    splitResult: SplitQueryResult;
    onPartClick?: (part: SplitPartResult) => void;
    expandedByDefault?: boolean;
}

// 词典条目显示组件（简化版）
const SanskritDictionaryEntryDisplay: React.FC<{ entry: any }> = ({ entry }) => {
    const [showAll, setShowAll] = useState(false);
    
    if (!entry) return null;
    
    return (
        <div className="sanskrit-dictionary-entry">
            <div className="entry-header">
                <h4 className="entry-word">{entry.word}</h4>
                {entry.partOfSpeech && (
                    <span className="part-of-speech">{entry.partOfSpeech}</span>
                )}
            </div>
            
            {entry.definitions && entry.definitions.length > 0 && (
                <div className="definitions">
                    <h5>释义:</h5>
                    <ul>
                        {(showAll ? entry.definitions : entry.definitions.slice(0, 3)).map((def: string, idx: number) => (
                            <li key={idx}>{def}</li>
                        ))}
                    </ul>
                    {entry.definitions.length > 3 && (
                        <button 
                            className="show-more-btn"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? '显示更少' : `显示全部 ${entry.definitions.length} 条释义`}
                        </button>
                    )}
                </div>
            )}
            
            {entry.etymology && (
                <div className="etymology">
                    <h5>词源:</h5>
                    <p>{entry.etymology}</p>
                </div>
            )}
            
            {entry.examples && entry.examples.length > 0 && (
                <div className="examples">
                    <h5>例句:</h5>
                    <ul>
                        {entry.examples.map((ex: string, idx: number) => (
                            <li key={idx}>{ex}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const SanskritSplitDisplay: React.FC<SanskritSplitDisplayProps> = ({
    splitResult,
    onPartClick,
    expandedByDefault = false
}) => {
    const [expandedParts, setExpandedParts] = useState<Set<number>>(
        expandedByDefault ? new Set(splitResult.splitParts.map((_, i) => i)) : new Set()
    );
    
    const togglePartExpansion = (index: number) => {
        const newExpanded = new Set(expandedParts);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedParts(newExpanded);
    };
    
    // 渲染拆分部分
    const renderSplitParts = () => {
        return splitResult.splitParts.map((part, index) => (
            <div 
                key={index} 
                className={`split-part ${expandedParts.has(index) ? 'expanded' : ''}`}
                onClick={() => onPartClick?.(part)}
            >
                <div className="part-header" onClick={(e) => {
                    e.stopPropagation();
                    togglePartExpansion(index);
                }}>
                    <div className="part-info">
                        <span className="part-position">#{index + 1}</span>
                        <span className="part-text">{part.originalPart}</span>
                        <span className="part-confidence">
                            置信度: {(part.confidence * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div className="part-grammar">
                        {part.grammaticalInfo.case && (
                            <span className="grammar-tag case">{part.grammaticalInfo.case}</span>
                        )}
                        {part.grammaticalInfo.number && (
                            <span className="grammar-tag number">{part.grammaticalInfo.number}</span>
                        )}
                        {part.grammaticalInfo.gender && (
                            <span className="grammar-tag gender">{part.grammaticalInfo.gender}</span>
                        )}
                    </div>
                    <div className="expand-toggle">
                        {expandedParts.has(index) ? '▲' : '▼'}
                    </div>
                </div>
                
                {expandedParts.has(index) && (
                    <div className="part-details">
                        {part.dictionaryEntry?.entries?.length > 0 ? (
                            <div className="dictionary-results">
                                <h5>词典查询结果:</h5>
                                {part.dictionaryEntry.entries.map((entry, entryIndex) => (
                                    <SanskritDictionaryEntryDisplay
                                        key={entryIndex}
                                        entry={entry}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                未找到词典条目
                            </div>
                        )}
                        
                        {part.grammaticalInfo.sandhiRule && (
                            <div className="sandhi-info">
                                <strong>Sandhi规则:</strong> {part.grammaticalInfo.sandhiRule}
                            </div>
                        )}
                    </div>
                )}
            </div>
        ));
    };
    
    // 渲染整体分析
    const renderCombinedAnalysis = () => {
        return (
            <div className="combined-analysis">
                <h4>复合词整体分析</h4>
                
                {splitResult.combinedAnalysis.compoundMeaning && (
                    <div className="compound-meaning">
                        <strong>整体词义:</strong> {splitResult.combinedAnalysis.compoundMeaning}
                    </div>
                )}
                
                <div className="grammatical-structure">
                    <strong>语法结构:</strong> {splitResult.combinedAnalysis.grammaticalStructure}
                </div>
                
                {splitResult.combinedAnalysis.sandhiRulesApplied.length > 0 && (
                    <div className="sandhi-rules">
                        <strong>应用的Sandhi规则:</strong>
                        <ul>
                            {splitResult.combinedAnalysis.sandhiRulesApplied.map((rule, index) => (
                                <li key={index}>{rule}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };
    
    // 渲染拆分过程可视化
    const renderSplitVisualization = () => {
        const parts = splitResult.splitParts;
        
        return (
            <div className="split-visualization">
                <h4>Sandhi拆分过程</h4>
                <div className="visualization-container">
                    <div className="original-word">
                        {splitResult.originalWord}
                    </div>
                    
                    <div className="split-arrow">↓ 拆分</div>
                    
                    <div className="split-parts-visual">
                        {parts.map((part, index) => (
                            <React.Fragment key={index}>
                                <div className="visual-part">
                                    <div className="part-box">
                                        {part.originalPart}
                                    </div>
                                    <div className="part-label">
                                        部分 {index + 1}
                                    </div>
                                </div>
                                {index < parts.length - 1 && (
                                    <div className="plus-sign">+</div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    
                    {parts.length > 1 && (
                        <>
                            <div className="recombine-arrow">↓ 重组</div>
                            
                            <div className="recombined-word">
                                {parts.map(p => p.originalPart).join('')}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };
    
    return (
        <div className="sanskrit-split-display">
            <div className="split-header">
                <h3>梵语Sandhi拆分分析</h3>
                <div className="query-info">
                    查询耗时: {splitResult.queryTime}ms | 
                    拆分部分: {splitResult.splitParts.length}个
                </div>
            </div>
            
            {renderSplitVisualization()}
            
            <div className="split-parts-container">
                <h4>拆分部分详细分析</h4>
                {renderSplitParts()}
            </div>
            
            {renderCombinedAnalysis()}
            
            <style>{`
                .sanskrit-split-display {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    border: 1px solid #e1e4e8;
                    border-radius: 6px;
                    padding: 16px;
                    background: white;
                    margin: 16px 0;
                }
                
                .split-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #f6f8fa;
                }
                
                .split-header h3 {
                    margin: 0;
                    color: #24292e;
                    font-size: 18px;
                }
                
                .query-info {
                    color: #6a737d;
                    font-size: 14px;
                }
                
                .split-visualization {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: #f6f8fa;
                    border-radius: 6px;
                }
                
                .split-visualization h4 {
                    margin-top: 0;
                    margin-bottom: 16px;
                    color: #0366d6;
                }
                
                .visualization-container {
                    text-align: center;
                    padding: 10px 0;
                }
                
                .original-word, .recombined-word {
                    font-size: 24px;
                    font-weight: bold;
                    color: #0366d6;
                    margin: 10px 0;
                    font-family: 'Noto Sans Devanagari', 'Segoe UI', sans-serif;
                }
                
                .split-parts-visual {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin: 20px 0;
                }
                
                .visual-part {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .part-box {
                    padding: 8px 16px;
                    background: white;
                    border: 2px solid #0366d6;
                    border-radius: 4px;
                    font-size: 18px;
                    font-weight: bold;
                    min-width: 60px;
                    font-family: 'Noto Sans Devanagari', 'Segoe UI', sans-serif;
                }
                
                .part-label {
                    font-size: 12px;
                    color: #6a737d;
                    margin-top: 4px;
                }
                
                .plus-sign {
                    font-size: 20px;
                    color: #6a737d;
                    margin: 0 8px;
                }
                
                .split-arrow, .recombine-arrow {
                    font-size: 16px;
                    color: #6a737d;
                    margin: 8px 0;
                    font-style: italic;
                }
                
                .split-parts-container {
                    margin-bottom: 24px;
                }
                
                .split-parts-container h4 {
                    margin-top: 0;
                    margin-bottom: 16px;
                    color: #0366d6;
                }
                
                .split-part {
                    border: 1px solid #e1e4e8;
                    border-radius: 6px;
                    margin-bottom: 12px;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }
                
                .split-part:hover {
                    border-color: #0366d6;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .split-part.expanded {
                    border-color: #0366d6;
                }
                
                .part-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: #f6f8fa;
                    cursor: pointer;
                    user-select: none;
                }
                
                .part-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }
                
                .part-position {
                    background: #0366d6;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .part-text {
                    font-size: 18px;
                    font-weight: bold;
                    font-family: 'Noto Sans Devanagari', 'Segoe UI', sans-serif;
                    flex: 1;
                }
                
                .part-confidence {
                    font-size: 12px;
                    color: #6a737d;
                    background: #f1f8ff;
                    padding: 2px 8px;
                    border-radius: 12px;
                }
                
                .part-grammar {
                    display: flex;
                    gap: 6px;
                    margin-right: 12px;
                }
                
                .grammar-tag {
                    font-size: 11px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                
                .grammar-tag.case {
                    background: #d1f7c4;
                    color: #0e4429;
                }
                
                .grammar-tag.number {
                    background: #ffe3e3;
                    color: #86181d;
                }
                
                .grammar-tag.gender {
                    background: #dbedff;
                    color: #032f62;
                }
                
                .expand-toggle {
                    color: #6a737d;
                    font-size: 12px;
                }
                
                .part-details {
                    padding: 16px;
                    background: white;
                    border-top: 1px solid #e1e4e8;
                }
                
                .dictionary-results h5 {
                    margin-top: 0;
                    margin-bottom: 12px;
                    color: #24292e;
                    font-size: 14px;
                }
                
                .sanskrit-dictionary-entry {
                    background: #f8f9fa;
                    border-radius: 4px;
                    padding: 12px;
                    margin-bottom: 12px;
                }
                
                .entry-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                
                .entry-word {
                    margin: 0;
                    font-size: 16px;
                    font-weight: bold;
                    color: #0366d6;
                }
                
                .part-of-speech {
                    font-size: 12px;
                    background: #e9ecef;
                    color: #495057;
                    padding: 2px 8px;
                    border-radius: 12px;
                }
                
                .definitions h5,
                .etymology h5,
                .examples h5 {
                    font-size: 13px;
                    color: #6a737d;
                    margin: 8px 0 4px 0;
                }
                
                .definitions ul,
                .examples ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .definitions li,
                .examples li {
                    margin-bottom: 4px;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .show-more-btn {
                    font-size: 12px;
                    color: #0366d6;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px 8px;
                    margin-top: 4px;
                }
                
                .show-more-btn:hover {
                    text-decoration: underline;
                }
                
                .etymology p {
                    margin: 4px 0;
                    font-size: 14px;
                    line-height: 1.4;
                    color: #6a737d;
                }
                
                .no-results {
                    color: #6a737d;
                    font-style: italic;
                    padding: 12px;
                    text-align: center;
                    background: #f6f8fa;
                    border-radius: 4px;
                }
                
                .sandhi-info {
                    margin-top: 12px;
                    padding: 8px 12px;
                    background: #fff8c5;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .combined-analysis {
                    padding: 16px;
                    background: #f0f9ff;
                    border-radius: 6px;
                    border: 1px solid #c8e1ff;
                }
                
                .combined-analysis h4 {
                    margin-top: 0;
                    margin-bottom: 16px;
                    color: #0366d6;
                }
                
                .compound-meaning,
                .grammatical-structure,
                .sandhi-rules {
                    margin-bottom: 12px;
                    font-size: 14px;
                }
                
                .compound-meaning {
                    font-size: 16px;
                    line-height: 1.5;
                }
                
                .sandhi-rules ul {
                    margin: 8px 0 0 0;
                    padding-left: 20px;
                }
                
                .sandhi-rules li {
                    margin-bottom: 4px;
                    font-family: monospace;
                    font-size: 13px;
                }
                
                @media (max-width: 768px) {
                    .split-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    
                    .part-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    
                    .part-info {
                        width: 100%;
                        justify-content: space-between;
                    }
                    
                    .part-grammar {
                        width: 100%;
                        justify-content: flex-start;
                        margin: 8px 0 0 0;
                    }
                    
                    .split-parts-visual {
                        flex-direction: column;
                    }
                    
                    .visual-part {
                        width: 100%;
                        margin-bottom: 12px;
                    }
                    
                    .part-box {
                        width: 100%;
                        text-align: center;
                    }
                    
                    .plus-sign {
                        margin: 4px 0;
                    }
                }
            `}</style>
        </div>
    );
};
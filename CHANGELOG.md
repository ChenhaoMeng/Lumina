# Luminous Lute - Language Learning Reader

## Recent Updates (2025-02-19)

### 🔥 Sanskrit Support (最重要功能!)

梵语支持是本应用的核心功能!

- **Dharma Mitra API集成** - 梵语语法分析
- **Sandhi分词** - 自动拆分复合词
- **词根查找** - 词典词根查询
- **语法分析** - 词性标注、动词变位
- **含义提取** - 多重含义显示
- **转写方案支持** - Devanagari, IAST, SLP1, Harvard-Kyoto, ITRANS, WX, Velthuis, ISO 15919等
- **自动处理** - 选择梵语词汇时自动分析

### UI/UX Improvements

#### 1. Dictionary Results - Prominent Display
- Moved Wiktionary results to a separate, prominent section at the top of the sidebar
- Added part of speech filtering (noun, verb, adj, adv)
- Implemented deduplication of entries
- Added visual markers for:
  - Root words (green badge)
  - Variants (amber badge)
  - Inflections (purple badge)
- Enhanced display with:
  - IPA pronunciation
  - Etymology
  - Synonyms and antonyms
  - Usage examples

#### 2. Continue Reading Feature
- Added "Reader" button to navigation bar
- Shows "Continue" badge when there's a last read document
- Clicking continues from the last reading position
- Falls back to most recent document if last read was deleted

#### 3. Theme Unification
- Unified theme colors across all components:
  - TermSidebar
  - LibraryView
  - Navigation bar
- All 7 themes now consistently apply:
  - Light
  - Dark
  - Sepia
  - Night
  - High Contrast
  - Paper
  - Auto

#### 4. Book Cover Display
- Added gradient book covers with depth effect
- Color coding by source type:
  - Rose gradient (PDF)
  - Emerald gradient (EPUB)
  - Indigo gradient (plain text)
- Added shadow and overlay effects

#### 5. Vocabulary Highlighting in Reader
- Fixed term lookup to properly find vocabulary words
- Words in vocabulary are now highlighted based on learning status:
  - Learning1: Rose background
  - Learning2: Orange background
  - Learning3: Amber background
  - Learning4: Lime background
  - WellKnown: Medium weight text
  - Ignored: Strikethrough

### Bug Fixes
- Fixed book card click functionality in Library
- Removed redundant Continue button from book cards
- Various UI refinements

---

## Previous Releases

### v1.1.0
- Complete theming support
- Bug fixes and improvements

### v1.0.0
- Initial release
- PDF/EPUB/Text reading
- Vocabulary building with spaced repetition
- Wiktionary integration
- AI-powered analysis
- Multi-language support
- Theme customization

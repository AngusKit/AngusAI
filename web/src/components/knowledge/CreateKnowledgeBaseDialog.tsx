import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateKnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 扩展的图标选项 - 32个图标
const iconOptions = [
  { emoji: '📘', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '书籍' },
  { emoji: '🎓', bg: 'bg-green-100 dark:bg-green-900/30', label: '学术' },
  { emoji: '📋', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '列表' },
  { emoji: '📁', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '文件夹' },
  { emoji: '📚', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: '图书馆' },
  { emoji: '💼', bg: 'bg-gray-100 dark:bg-gray-700/30', label: '公文包' },
  { emoji: '🎯', bg: 'bg-red-100 dark:bg-red-900/30', label: '目标' },
  { emoji: '💡', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '想法' },
  { emoji: '🔬', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '科研' },
  { emoji: '🏆', bg: 'bg-amber-100 dark:bg-amber-900/30', label: '成就' },
  { emoji: '🌟', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '星星' },
  { emoji: '🎨', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '艺术' },
  { emoji: '⚙️', bg: 'bg-slate-100 dark:bg-slate-700/30', label: '设置' },
  { emoji: '🚀', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '火箭' },
  { emoji: '📊', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '数据' },
  { emoji: '🔒', bg: 'bg-red-100 dark:bg-red-900/30', label: '安全' },
  { emoji: '🎭', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '戏剧' },
  { emoji: '🎬', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: '电影' },
  { emoji: '🎮', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '游戏' },
  { emoji: '🎪', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '马戏团' },
  { emoji: '🌈', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '彩虹' },
  { emoji: '🔥', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '火焰' },
  { emoji: '⚡', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '闪电' },
  { emoji: '🌙', bg: 'bg-indigo-100 dark:bg-indigo-900/30', label: '月亮' },
  { emoji: '☀️', bg: 'bg-amber-100 dark:bg-amber-900/30', label: '太阳' },
  { emoji: '🌍', bg: 'bg-green-100 dark:bg-green-900/30', label: '地球' },
  { emoji: '💎', bg: 'bg-cyan-100 dark:bg-cyan-900/30', label: '钻石' },
  { emoji: '🎁', bg: 'bg-red-100 dark:bg-red-900/30', label: '礼物' },
  { emoji: '🔑', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '钥匙' },
  { emoji: '🏠', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '房屋' },
  { emoji: '✨', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '闪光' },
  { emoji: '🌺', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '花朵' },
];

export function CreateKnowledgeBaseDialog({ open, onOpenChange }: CreateKnowledgeBaseDialogProps) {
  const [kbName, setKbName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // 标签颜色映射
  const getTagColor = (tag: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    ];
    
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      if (!newTag) return;
      
      if (newTag.length > 10) {
        toast.error('标签长度不能超过10个字符');
        return;
      }
      
      if (tags.length >= 5) {
        toast.error('最多只能添加5个标签');
        return;
      }
      
      if (tags.includes(newTag)) {
        toast.error('标签已存在');
        return;
      }
      
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreate = () => {
    if (!kbName.trim()) {
      toast.error('请输入知识库名称');
      return;
    }
    if (!description.trim()) {
      toast.error('请输入知识库描述');
      return;
    }

    // 创建知识库
    toast.success('知识库创建成功！');
    
    // 重置表单
    setKbName('');
    setDescription('');
    setVisibility('private');
    setSelectedIcon(0);
    setTags([]);
    setTagInput('');
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // 重置表单
    setKbName('');
    setDescription('');
    setVisibility('private');
    setSelectedIcon(0);
    setTags([]);
    setTagInput('');
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">创建知识库</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            创建一个新的知识库来组织和管理您的文档
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* 名称和可见性在同一行 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-2 block dark:text-gray-300">知识库名称</Label>
              <Input
                value={kbName}
                onChange={(e) => setKbName(e.target.value)}
                placeholder="请输入知识库名称"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block dark:text-gray-300">可见性</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="private" className="dark:text-white">私有</SelectItem>
                  <SelectItem value="team" className="dark:text-white">团队可见</SelectItem>
                  <SelectItem value="public" className="dark:text-white">公开</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <Label className="text-sm mb-2 block dark:text-gray-300">描述</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入知识库描述"
              rows={3}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* 标签 */}
          <div>
            <Label className="text-sm mb-2 block dark:text-gray-300">
              标签 <span className="text-gray-400">({tags.length}/5)</span>
            </Label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="输入标签后按回车，最多5个，每个不超过10字符"
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={tags.length >= 5}
              maxLength={10}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className={`border-0 ${getTagColor(tag)}`}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:opacity-70 transition-opacity"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 图标 - 超过两排时可滚动 */}
          <div>
            <Label className="text-sm mb-2 block dark:text-gray-300">图标</Label>
            <div className="max-h-[140px] overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIcon(index)}
                    className={`${option.bg} w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                      selectedIcon === index 
                        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' 
                        : 'hover:scale-105'
                    }`}
                    title={option.label}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            取消
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            创建
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

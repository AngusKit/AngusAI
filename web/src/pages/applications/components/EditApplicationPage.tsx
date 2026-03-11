import { ChevronLeft, Search, Bot, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { getTagColor } from '../utils';
import { useEditApplication } from '../hooks';
import { EmojiIconSelector } from './EmojiIconSelector';
import { NAME_MAX_LENGTH, DESC_MAX_LENGTH, TAG_MAX_COUNT, TAG_MAX_LENGTH } from '../constants';

/**
 * 编辑应用页：修改应用基本信息与绑定智能体
 */
export function EditApplicationPage() {
  const {
    loading,
    detail,
    agentSearchQuery,
    setAgentSearchQuery,
    agentsList,
    agentsLoading,
    selectedAgentIds,
    defaultAgentId,
    name,
    setName,
    description,
    setDescription,
    icon,
    setIcon,
    tagInput,
    setTagInput,
    tags,
    submitting,
    addTag,
    removeTag,
    toggleAgent,
    setAsDefault,
    handleSave,
    handleBack,
  } = useEditApplication();

  if (loading || !detail) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold dark:text-white">编辑应用</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">修改应用的基本信息和绑定智能体</p>
      </div>

      <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 space-y-6">
        <div>
          <Label className="dark:text-gray-300">应用名称</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value.slice(0, NAME_MAX_LENGTH))}
            placeholder="我的智能助手"
            maxLength={NAME_MAX_LENGTH}
            className="mt-2 dark:bg-gray-900 dark:border-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">{name.length}/{NAME_MAX_LENGTH}</p>
        </div>
        <div>
          <Label className="dark:text-gray-300">应用图标（emoji）</Label>
          <div className="mt-2">
            <EmojiIconSelector value={icon} onChange={setIcon} />
          </div>
        </div>
        <div>
          <Label className="dark:text-gray-300">应用介绍</Label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, DESC_MAX_LENGTH))}
            placeholder="简要描述应用的功能和用途"
            rows={3}
            maxLength={DESC_MAX_LENGTH}
            className="mt-2 dark:bg-gray-900 dark:border-gray-700 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/{DESC_MAX_LENGTH}</p>
        </div>
        <div>
          <Label className="dark:text-gray-300">标签（最多 {TAG_MAX_COUNT} 个，每项最多 {TAG_MAX_LENGTH} 字符）</Label>
          <div className="space-y-2 mt-2">
            {tags.length < TAG_MAX_COUNT && (
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value.slice(0, TAG_MAX_LENGTH))}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder={`输入后按回车，最多 ${TAG_MAX_LENGTH} 字符`}
                  maxLength={TAG_MAX_LENGTH}
                  className="w-64 min-w-[200px] dark:bg-gray-900"
                />
                <Button type="button" size="sm" variant="outline" onClick={addTag}>
                  添加
                </Button>
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <Badge key={i} variant="secondary" className={`cursor-pointer border ${getTagColor(t, i)}`} onClick={() => removeTag(i)}>
                    {t} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <Label className="dark:text-gray-300">绑定智能体</Label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">至少选择一个智能体，默认智能体将用于对话</p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索智能体..."
              value={agentSearchQuery}
              onChange={e => setAgentSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
          <ScrollArea className="h-[240px] border rounded-lg dark:border-gray-700 p-2">
            {agentsLoading ? (
              <div className="py-8 text-center text-gray-500">加载中...</div>
            ) : agentsList.length === 0 ? (
              <div className="py-8 text-center text-gray-500">暂无智能体</div>
            ) : (
              <div className="space-y-1">
                {agentsList.map(agent => {
                  const selected = selectedAgentIds.includes(agent.id);
                  const isDefault = defaultAgentId === agent.id;
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm dark:text-white">{agent.name}</span>
                        {selected && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                      {selected && (
                        <Button
                          size="sm"
                          variant={isDefault ? 'default' : 'outline'}
                          className="text-xs h-7"
                          onClick={e => {
                            e.stopPropagation();
                            setAsDefault(agent.id);
                          }}
                        >
                          {isDefault ? '默认' : '设为默认'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="dark:bg-gray-800 dark:border-gray-700">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
        <Button onClick={handleSave} disabled={submitting} className="bg-blue-500 hover:bg-blue-600">
          {submitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  );
}

package cloud.xcan.angus.core.ai.application.query.prompt.impl;

import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategoryRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import jakarta.annotation.Resource;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * 提示词分类查询服务实现
 */
@Service
public class PromptCategoryQueryImpl implements PromptCategoryQuery {

  @Resource
  private PromptCategoryRepo promptCategoryRepo;

  @Resource
  private PromptRepo promptRepo;

  @Override
  public PromptCategory findAndCheck(Long id) {
    return new BizTemplate<PromptCategory>() {
      @Override
      protected PromptCategory process() {
        PromptCategory category = promptCategoryRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("分类未找到", new Object[]{}));
        setPromptCount(List.of(category));
        return category;
      }
    }.execute();
  }

  @Override
  public List<PromptCategory> findAll() {
    return new BizTemplate<List<PromptCategory>>() {
      @Override
      protected List<PromptCategory> process() {
        List<PromptCategory> categories = promptCategoryRepo.findAllSystemAndCreatedBy(
            PrincipalContext.getUserId());
        setPromptCount(categories);
        return categories;
      }
    }.execute();
  }

  @Override
  public boolean exists(Long id) {
    return promptCategoryRepo.findById(id).isPresent();
  }

  @Override
  public int calculateCategoryLevel(Long parentId) {
    if (parentId == null) {
      return 1; // 第一级
    }

    PromptCategory parent = promptCategoryRepo.findById(parentId)
        .orElseThrow(() -> ResourceNotFound.of("父分类不存在", new Object[]{}));

    // 递归计算父分类的层级深度
    return calculateCategoryLevel(parent.getParentId()) + 1;
  }

  @Override
  public void setPromptCount(List<PromptCategory> categories) {
    if (categories == null || categories.isEmpty()) {
      return;
    }

    // Load all categories the user can see (system + createdBy)
    List<PromptCategory> accessible = promptCategoryRepo.findAllSystemAndCreatedBy(
        PrincipalContext.getUserId());
    if (accessible == null || accessible.isEmpty()) {
      for (PromptCategory c : categories) {
        if (c != null) {
          c.setPromptCount(0L);
        }
      }
      return;
    }

    // Build parentId -> children map and id->node map
    Map<Long, List<PromptCategory>> childrenMap = new HashMap<>();
    Map<Long, PromptCategory> nodeById = new HashMap<>();
    for (PromptCategory c : accessible) {
      if (c == null || c.getId() == null) {
        continue;
      }
      nodeById.put(c.getId(), c);
      Long pid = c.getParentId();
      childrenMap.computeIfAbsent(pid, k -> new ArrayList<>()).add(c);
    }

    // Collect all ids we need to query: union of all requested roots' reachable subtree ids
    Set<Long> idsToQuery = new HashSet<>();
    List<Long> rootsToProcess = new ArrayList<>();
    for (PromptCategory root : categories) {
      if (root == null || root.getId() == null) {
        continue;
      }
      Long id = root.getId();
      if (nodeById.containsKey(id)) {
        rootsToProcess.add(id);
      }
    }
    if (rootsToProcess.isEmpty()) {
      for (PromptCategory c : categories) {
        if (c != null) {
          c.setPromptCount(0L);
        }
      }
      return;
    }

    // BFS from each root to gather all ids in their subtrees (avoid duplicates)
    ArrayDeque<Long> queue = new ArrayDeque<>();
    Set<Long> seen = new HashSet<>();
    for (Long rootId : rootsToProcess) {
      if (seen.add(rootId)) {
        queue.add(rootId);
      }
    }
    while (!queue.isEmpty()) {
      Long cur = queue.poll();
      idsToQuery.add(cur);
      List<PromptCategory> children = childrenMap.get(cur);
      if (children == null) {
        continue;
      }
      for (PromptCategory child : children) {
        if (child == null || child.getId() == null) {
          continue;
        }
        if (seen.add(child.getId())) {
          queue.add(child.getId());
        }
      }
    }

    if (idsToQuery.isEmpty()) {
      for (PromptCategory c : categories) {
        if (c != null) {
          c.setPromptCount(0L);
        }
      }
      return;
    }

    // Batch query direct counts for all ids in one go
    List<Object[]> rows = promptRepo.countByCategoryIds(new ArrayList<>(idsToQuery));
    Map<Long, Long> directCounts = new HashMap<>();
    if (rows != null) {
      for (Object[] row : rows) {
        if (row == null || row.length < 2) {
          continue;
        }
        Long cid = ((Number) row[0]).longValue();
        Long cnt = ((Number) row[1]).longValue();
        directCounts.put(cid, cnt);
      }
    }

    // Compute aggregated counts (subtree sums) via iterative post-order traversal
    Map<Long, Long> aggregated = new HashMap<>();
    Set<Long> visited = new HashSet<>();
    for (Long rootId : rootsToProcess) {
      if (visited.contains(rootId)) {
        continue;
      }
      // iterative post-order: push (id,false) encoded by sign using separate marker map
      ArrayDeque<Long> nodeStack = new ArrayDeque<>();
      nodeStack.push(rootId);
      while (!nodeStack.isEmpty()) {
        Long id = nodeStack.peek();
        if (id == null) {
          nodeStack.pop();
          continue;
        }
        if (visited.contains(id)) {
          nodeStack.pop();
          continue;
        }
        // if children not processed, push children first
        List<PromptCategory> ch = childrenMap.get(id);
        boolean allChildrenDone = true;
        if (ch != null && !ch.isEmpty()) {
          for (PromptCategory pc : ch) {
            Long cid = pc == null ? null : pc.getId();
            if (cid == null) {
              continue;
            }
            if (!visited.contains(cid)) {
              allChildrenDone = false;
              nodeStack.push(cid);
            }
          }
        }
        if (allChildrenDone) {
          // compute aggregated for id
          nodeStack.pop();
          long sum = directCounts.getOrDefault(id, 0L);
          List<PromptCategory> children = childrenMap.get(id);
          if (children != null) {
            for (PromptCategory child : children) {
              if (child == null || child.getId() == null) {
                continue;
              }
              sum += aggregated.getOrDefault(child.getId(), 0L);
            }
          }
          aggregated.put(id, sum);
          visited.add(id);
        }
      }
    }

    // Apply aggregated counts to requested categories
    for (PromptCategory root : categories) {
      if (root == null || root.getId() == null) {
        continue;
      }
      root.setPromptCount(aggregated.getOrDefault(root.getId(), 0L));
    }
  }
}

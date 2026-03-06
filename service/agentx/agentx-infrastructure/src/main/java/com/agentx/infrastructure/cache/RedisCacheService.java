package com.agentx.infrastructure.cache;

import java.time.Duration;
import java.util.Optional;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * Redis 缓存服务 —— 为 Agent 定义、会话等提供缓存支持
 */
@Component
@ConditionalOnBean(name = "agentxRedisTemplate")
public class RedisCacheService {

  private final RedisTemplate<String, Object> redisTemplate;

  public RedisCacheService(RedisTemplate<String, Object> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  public void put(String key, Object value, Duration ttl) {
    redisTemplate.opsForValue().set(key, value, ttl);
  }

  public Optional<Object> get(String key) {
    return Optional.ofNullable(redisTemplate.opsForValue().get(key));
  }

  public void evict(String key) {
    redisTemplate.delete(key);
  }

  public boolean exists(String key) {
    return Boolean.TRUE.equals(redisTemplate.hasKey(key));
  }
}

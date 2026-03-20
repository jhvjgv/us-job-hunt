package com.usjobhunt.util;

import org.springframework.stereotype.Component;

/**
 * 雪花算法 (Snowflake) ID 生成器
 * 用于生成全局唯一的、趋势递增的 64 位 Long 类型 ID
 * 
 * 结构：
 * 1 bit: 符号位（始终为 0）
 * 41 bits: 时间戳（毫秒级，可支持 69 年）
 * 10 bits: 数据中心 ID + 机器 ID（可支持 1024 个节点）
 * 12 bits: 序列号（同一毫秒内可生成 4096 个 ID）
 */
@Component
public class SnowflakeIdGenerator {
    
    // 起始时间戳（2020-01-01 00:00:00）
    private static final long EPOCH = 1577836800000L;
    
    // 各部分的位移
    private static final long TIMESTAMP_SHIFT = 22;
    private static final long DATACENTER_SHIFT = 17;
    private static final long MACHINE_SHIFT = 12;
    private static final long SEQUENCE_MASK = 0xFFF;
    
    // 数据中心 ID（0-31）
    private final long datacenterId;
    
    // 机器 ID（0-31）
    private final long machineId;
    
    // 序列号
    private long sequence = 0;
    
    // 上一次生成 ID 的时间戳
    private long lastTimestamp = -1;
    
    /**
     * 构造函数
     * @param datacenterId 数据中心 ID（0-31）
     * @param machineId 机器 ID（0-31）
     */
    public SnowflakeIdGenerator(long datacenterId, long machineId) {
        if (datacenterId < 0 || datacenterId > 31) {
            throw new IllegalArgumentException("datacenterId must be between 0 and 31");
        }
        if (machineId < 0 || machineId > 31) {
            throw new IllegalArgumentException("machineId must be between 0 and 31");
        }
        this.datacenterId = datacenterId;
        this.machineId = machineId;
    }
    
    /**
     * 默认构造函数（使用默认的数据中心 ID 和机器 ID）
     */
    public SnowflakeIdGenerator() {
        this(1, 1);
    }
    
    /**
     * 生成下一个 ID
     */
    public synchronized long nextId() {
        long timestamp = System.currentTimeMillis();
        
        // 如果当前时间小于上一次生成 ID 的时间，说明系统时钟回退了
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("Clock moved backwards. Refusing to generate id for " +
                    (lastTimestamp - timestamp) + " milliseconds");
        }
        
        // 如果是同一毫秒内
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & SEQUENCE_MASK;
            // 如果序列号溢出，等待下一毫秒
            if (sequence == 0) {
                timestamp = waitNextMillis(lastTimestamp);
            }
        } else {
            // 不同毫秒，序列号重置
            sequence = 0;
        }
        
        lastTimestamp = timestamp;
        
        // 组合各部分生成最终的 ID
        return ((timestamp - EPOCH) << TIMESTAMP_SHIFT) |
                (datacenterId << DATACENTER_SHIFT) |
                (machineId << MACHINE_SHIFT) |
                sequence;
    }
    
    /**
     * 等待下一毫秒
     */
    private long waitNextMillis(long lastTimestamp) {
        long timestamp = System.currentTimeMillis();
        while (timestamp <= lastTimestamp) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }
    
    /**
     * 获取 ID 的时间戳部分
     */
    public static long getTimestamp(long id) {
        return ((id >> TIMESTAMP_SHIFT) + EPOCH);
    }
    
    /**
     * 获取 ID 的数据中心 ID 部分
     */
    public static long getDatacenterId(long id) {
        return (id >> DATACENTER_SHIFT) & 0x1F;
    }
    
    /**
     * 获取 ID 的机器 ID 部分
     */
    public static long getMachineId(long id) {
        return (id >> MACHINE_SHIFT) & 0x1F;
    }
    
    /**
     * 获取 ID 的序列号部分
     */
    public static long getSequence(long id) {
        return id & SEQUENCE_MASK;
    }
}

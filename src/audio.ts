// 创建一个 AudioContext
const context = new AudioContext();

// Oscillator 节点
const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

// Gain 节点
const volume = context.createGain();
volume.gain.value = 0.5;

// destination 节点
const out = context.destination;

// 用 Map 保存 id -> 节点 的字典
const nodes = new Map();

// 内置三个节点
nodes.set('a', osc);
nodes.set('b', volume);
nodes.set('c', out);

/**
 * 判断上下文是否在播放
 * @returns boolean
 */
export function isRunning() {
    return context.state === 'running';
}

/**
 * 触发 audio 上下文
 * - 如果当前上下文未播放，则开始播放
 * - 如果当前上下文正在播放，则停止
 */
export function toggleAudio() {
    return isRunning() ? context.suspend() : context.resume();
}

/**
 * 更新节点数据
 * @param id 
 * @param data 
 */
export function updateAudioNode(id: string, data: Record<string, any>) {
    const node = nodes.get(id);

    for (const [key, val] of Object.entries(data)) {
        if (node[key] instanceof AudioParam) {
            node[key].value = val;
        } else {
            node[key] = val;
        }
    }
}

/**
 * 删除节点
 * @param id 
 */
export function removeAudioNode(id: string) {
    const node = nodes.get(id);

    // 删除前先断掉当前节点所有连接
    node.disconnect();
    // 停止节点振荡器
    node.stop?.();
    // 从 Map 中删除记录
    nodes.delete(id);
}

/**
 * 连接节点
 * @param sourceId 
 * @param targetId 
 */
export function connect(sourceId: string, targetId: string) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);

    source.connect(target);
}

/**
 * 断开连接
 * @param sourceId 
 * @param targetId 
 */
export function disconnect(sourceId: string, targetId: string) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);
    source.disconnect(target);
}

/**
 * 创建振荡器
 * @param id 振荡器 id
 * @param type 类型
 * @param data 初始化数据
 */
export function createAudioNode(id: string, type: string, data: Record<string, any>) {
    switch (type) {
        case 'osc': {
            const node = context.createOscillator();
            node.frequency.value = data.frequency;
            node.type = data.type;
            node.start();

            nodes.set(id, node);
            break;
        }

        case 'volume': {
            const node = context.createGain();
            node.gain.value = data.gain;

            nodes.set(id, node);
            break;
        }
    }
}

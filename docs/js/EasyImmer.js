
const DRAFT_STATE = Symbol('immer-draft-state')
// 是不是带state的多重对象，这个function会访问到get如果是的话就有值
const isDraft = (value) => !!value && !!value[DRAFT_STATE]
const isObject = (value) => value !== null && typeof value === 'object'
const shallowCopy = (value) => Array.isArray(value) ? [...value] : {...value}

function createDraft(parent, base) {
  const state = {
    parent,
    base,
    copy: undefined
  }
  return new Proxy(state, {
    get(state, prop) {
      if (prop === DRAFT_STATE) return state
      if (state.copy) {
        const value = state.copy[prop]
        // 第一次进来，并且value还是个对象， 要遍历代理
        if (value === state.base[prop] && isObject(value)) {
          return (state.copy[prop] = createDraft(state, value))
        }
        return value
      }
      const value = state.base[prop]
      return value
    },
    set(state, prop, value) {
      if (!state.copy) {
        // 如果没有拷贝，并且和原来的一样，不用管
        if (value === state.base[prop]) return true
        // 如果没有拷贝，但是是新的值，需要去标记了
        markChanged(state)
      }
      // 有拷贝的情况下，改拷贝的值
      state.copy[prop] = value
      return true
    }
  })
}

function markChanged(state) {
  if (!state.copy) {
    state.copy = shallowCopy(state.base)
    if (state.parent) markChanged(state.parent)
  }
}

function finalize(draft) {
  if (isDraft(draft)) {
    // 是多重对象
    const state = draft[DRAFT_STATE]
    // 获取copy和原值
    const {copy, base} = state
    if (copy) {
      // 如果是copy说明它下面还有可能有多重对象，要都去解开。
      Object.entries(copy).forEach(([prop, value]) => {
        // 如果相等，就是原始对象
        if (value !== base[prop]) copy[prop] = finalize(value)
      })
      return copy
    }
    return base
  }
  // 不是多重对象或者是原值
  return draft
}
export function produce(base, producer) {
  const draft = createDraft(undefined, base);
  producer(draft)
  return finalize(draft)
}

const state = {
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  },
  "hh": {
    name: 'sex'
  }
};
const copy = produce(state, draft => {
  draft.website = 'www.org';
  draft.company.name = 'kljj';
});
 console.log(copy);
 console.log(state);
 console.log(copy.haha == state.haha);

#### 多节点 diff

```js
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    // 开发环境判断它是否有要警告的key，使用Set集合维护
    // First, validate keys.
    var knownKeys = null;

    for (var i = 0; i < newChildren.length; i++) {
        var child = newChildren[i];
        knownKeys = warnOnInvalidKey(child, knownKeys, returnFiber);
    }


    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;
    // 第一轮遍历
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
        if (oldFiber.index > newIdx) {
            nextOldFiber = oldFiber;
            oldFiber = null;
        } else {
            nextOldFiber = oldFiber.sibling;
        }
        // 判断当前节点是否可以复用
        var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
        // 为null代表不能复用
        if (newFiber === null) {
            // 如果oldFiber为null，代表新的节点多。更新oldFiber指向，退出第一轮循环
            if (oldFiber === null) {
                oldFiber = nextOldFiber;
            }
            break;
        }

        //TODO，看看别人分析的
        if (shouldTrackSideEffects) {
            // newFiber有值，但是alternate没有，说明type不一样，要标记删除
            if (oldFiber && newFiber.alternate === null) {
                // We matched the slot, but we didn't reuse the existing fiber, so we
                // need to delete the existing child.
                deleteChild(returnFiber, oldFiber);
            }
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
            resultingFirstChild = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }

        // 后移
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
    }
    // 第一轮新节点遍历结束

    // 第一个情况，新节点遍历完毕，说明它是做了`pop`这样的操作。那么直接把旧节点的剩余节点给删除就可以了。
    if (newIdx === newChildren.length) {
        // 如果第一轮遍历完了，说明新的节点跑完了，如果还有剩下的旧节点没跑的，直接删除
        // We've reached the end of the new children. We can delete the rest.
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
    }
    // 如果old是null
    // 第二个情况，老节点遍历完了，说明它是做了`push`这样的操作。那么直接循环创建剩下的新节点就可以了。
    if (oldFiber === null) {
        for (; newIdx < newChildren.length; newIdx++) {
            var _newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
            if (_newFiber === null) {
                continue;
            }

            lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
            if (previousNewFiber === null) {
                resultingFirstChild = _newFiber;
            } else {
                previousNewFiber.sibling = _newFiber;
            }
            previousNewFiber = _newFiber;
        }

        return resultingFirstChild;
    } // Add all children to a key map for quick lookups.

    // 第三个情况，新老节点都没遍历完，意思它要么做了替换操作，要么就是移动了顺序，要么就是`unshift`或者`shift`之类的操作。
    // 那么我们继续往下看
    // 这个mapRemainingChildren的作用，就是给剩下没跑完的oldFiber存入一个Map集合中，如果它有key，就用key做key值，如果没有，就用index做key值
    var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    for (; newIdx < newChildren.length; newIdx++) {
        // 这个updateFromMap类似于上面的updateSlot
        var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);

        if (_newFiber2 !== null) {
            if (shouldTrackSideEffects) {
                if (_newFiber2.alternate !== null) {
                    // The new fiber is a work in progress, but if there exists a
                    // current, that means that we reused the fiber. We need to delete
                    // it from the child list so that we don't add it to the deletion
                    // list.
                    existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
                }
            }

            lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);

            if (previousNewFiber === null) {
                resultingFirstChild = _newFiber2;
            } else {
                previousNewFiber.sibling = _newFiber2;
            }

            previousNewFiber = _newFiber2;
        }
    }

    if (shouldTrackSideEffects) {
        // Any existing children that weren't consumed above were deleted. We need
        // to add them to the deletion list.
        existingChildren.forEach(function (child) {
            return deleteChild(returnFiber, child);
        });
    }

    return resultingFirstChild;
}

// 判断是否可以复用节点
function updateSlot(
    returnFiber: Fiber,
    oldFiber: Fiber | null,
    newChild: any,
    lanes: Lanes,
): Fiber | null {
    const key = oldFiber !== null ? oldFiber.key : null;

    if (typeof newChild === 'string' || typeof newChild === 'number') {
        if (key !== null) {
            return null;
        }
        // 如果是文本或数字，直接更新数据即可
        return updateTextNode(returnFiber, oldFiber, '' + newChild, lanes);
    }

    if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
            // 我删除了其他case，主要看ReactElement
            case REACT_ELEMENT_TYPE: {
                // key相等
                if (newChild.key === key) {
                    // 这个updateElement里会判断标签类型是否一致，一致的话和单节点diff一样，直接复用了。
                    return updateElement(returnFiber, oldFiber, newChild, lanes);
                } else {
                    // key不相等直接不可复用，返回null
                    return null;
                }
            }
        }
    }
    // 如果是数组，咋可能复用啊，因为current.child一定是单节点了。返回null
    if (isArray(newChild) || getIteratorFn(newChild)) {
        if (key !== null) {
            return null;
        }

        return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
    }
    // 其他类型，返回null
    return null;
}
```

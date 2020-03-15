import * as types from './mutationTypes';
export default {
  [types.SAVE_NOW_DESK_ORDER_INFO](state, nowDeskOrderInfo) {
    state.nowDeskOrderInfo = nowDeskOrderInfo;
  },
  [types.SAVE_NOW_SEL_DESK](state, nowSelDesk) {
    state.nowSelDesk = nowSelDesk;
  },
  [types.SET_IS_ADD_ITEM](state, isAddItem) {
    state.isAddItem = isAddItem;
  },
  [types.SAVE_FIRST_ORDER_ID](state, firstOrderId) {
    state.firstOrderId = firstOrderId;
  },
  [types.REFRESH_NUM](state) {
    state.goodsNum++;
  },
}

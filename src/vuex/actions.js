export const store_d_routes = (context,Routes) => {
    context.commit('STORE_D_ROUTES',Routes)
}

export const clear_d_routes = ({commit}) => {
    commit('CLEAR_D_ROUTES')
}

export const store_permissions = (context,permissions) => {
    context.commit('STORE_PERMISSIONS',permissions)
}

export const clear_permissions = ({commit}) => {
    commit('CLEAR_PERMISSIONS')
}


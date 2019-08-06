export const filterlist = (lists) => {
  const newList = lists.filter(list => {
    if (list.hasChildren === true) {
      Object.assign(list, {children: null})
    }else {
      delete list.children
    }
    if (list.name) {
      const name = list.name
      Object.assign(list, {label: name})
    }
    return true
  })
  return newList
}

export const filterCompany = (lists) => {
  const newList = lists.filter(list => {
    if (list.hasChildren === true) {
      Object.assign(list, {children: null})
    }else {
      delete list.children
    }
    if (list.coName) {
      const name = list.coName
      Object.assign(list, {label: name})
    }
    return true
  })
  return newList
}

export const filterlistConame = (lists) => {
  const newList = lists.filter(list => {
    if (list.coName) {
      const name = list.coName
      Object.assign(list,{label: name})
    }

    if(list.children&&list.children.length>0){
     list.children = filterlistConame(list.children)
    }

    if (list.children&&list.children.length == 0) {
      delete(list.children)
    }
    return true
  })
  return newList
}

export const filterlistComname = (lists) => {
  const newList = lists.filter(list => {
    if (list.name) {
      const name = list.name
      Object.assign(list,{label: name})
    }

    if(list.children&&list.children.length>0){
      list.children = filterlistComname(list.children)
    }
    if (list.children.length == 0) {
      delete(list.children)
    }
    return true
  })
  return newList
}

export const filterlistOrg = (lists) => {
  const newList = lists.filter(list => {
    if (list.orgName) {
      const name = list.orgName
      Object.assign(list, {label: name})
    }
    if (list.children.length > 0) {
      list.children = filterlistOrg(list.children)
    }
    if (list.children.length == 0) {
      delete(list.children)
    }

    return true
  })
  return newList

}


export function filterCheck(list) {
  var coIdsList = []
  return filterlist3(list, coIdsList)
}

const filterlist3 = (lists, coIdsList) => {
  lists.filter(list => {
    if (list.hasChecked) {
      coIdsList.push(list.id)
    }
    if (list.children&&list.children.length > 0) {
      filterlist3(list.children,coIdsList)
    }
    return true
  })
  return coIdsList
}


export const filterlistRoles = (lists) => {
  const newList = lists.filter(list => {
    if (list.name) {
      const name = list.name
      Object.assign(list, {label: name})
    }
    if (list.children.length > 0) {
      list.children = filterlistRoles(list.children)
    }
    if (list.children.length == 0) {
      delete(list.children)
    }

    return true
  })
  return newList
}

// Keep typing words and images in sync with the selectable avatar catalog.
window.typingAvatarItems=window.ClassAvatarCatalog.items.map(item=>({
  answer:item.answer,name:item.name,category:item.category,group:item.group,
  image:'/assets/avatars/'+encodeURIComponent(item.key)
}));

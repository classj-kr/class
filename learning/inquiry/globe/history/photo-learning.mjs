import {PHOTOS} from './photos.mjs?v=20261019-photos';

export {PHOTOS};
export function photosForScene(sceneId) {
  return PHOTOS.filter(photo => Object.hasOwn(photo.bindings, sceneId));
}
export function photosForPlace(sceneId, point) {
  return photosForScene(sceneId).filter(photo => photo.bindings[sceneId].includes(point));
}

// A question photo uses only observable features until the solution is shown.
export function photoPresentation(photo, concealAnswer = false) {
  return concealAnswer
    ? {title: '문제 사진', alt: photo.alt, period: '', observe: '', connection: '', credit: ''}
    : {title: photo.title, alt: photo.alt, period: photo.period, observe: photo.observe, connection: photo.connection, credit: photo.credit};
}

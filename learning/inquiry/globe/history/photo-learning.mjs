import {PHOTOS} from './photos.mjs?v=20261019-multisource';

export {PHOTOS};
export function photosForScene(sceneId) {
  return PHOTOS.filter(photo => Object.hasOwn(photo.bindings, sceneId));
}
export function photosForPlace(sceneId, point) {
  return photosForScene(sceneId).filter(photo => photo.bindings[sceneId].includes(point));
}

// The source itself remains visible; identification and interpretation wait for a solution.
export function photoPresentation(photo, concealAnswer = false) {
  return concealAnswer
    ? {title: '문제 자료', alt: photo.alt, period: '', observe: '', connection: '', credit: ''}
    : {title: photo.title, alt: photo.alt, period: photo.period, observe: photo.observe, connection: photo.connection, credit: photo.credit};
}

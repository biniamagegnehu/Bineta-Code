export function parseProjectTechnologies(req, res, next) {
  if (typeof req.body.technologies === 'string') {
    try {
      req.body.technologies = JSON.parse(req.body.technologies);
    } catch {
      req.body.technologies = null;
    }
  }
  return next();
}

export function parseProfileSocialLinks(req, res, next) {
  if (typeof req.body.social_links === 'string') {
    try {
      req.body.social_links = JSON.parse(req.body.social_links);
    } catch {
      req.body.social_links = null;
    }
  }
  return next();
}

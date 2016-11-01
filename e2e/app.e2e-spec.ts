import { JobJobPage } from './app.po';

describe('job-job App', function() {
  let page: JobJobPage;

  beforeEach(() => {
    page = new JobJobPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

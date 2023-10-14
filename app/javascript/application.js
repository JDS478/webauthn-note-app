// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails

import "@hotwired/turbo-rails";
import "popper";
import "bootstrap";

import credential from 'helpers/credential';

addEventListener("DOMContentLoaded", () => {
  credential();
});

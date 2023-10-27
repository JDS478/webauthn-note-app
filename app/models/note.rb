# frozen_string_literal: true

class Note < ApplicationRecord
  belongs_to :user

  validates :title, presence: true

  def word_count
    content.split(' ').length
  end

  def first_words
    return 'No Content' if content.blank?

    line = content.split(/\s/)
    "#{line[0...8].join(' ')}..."
  end
end

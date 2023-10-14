# frozen_string_literal: true

class NotesController < ApplicationController
  before_action :set_note, only: %i[edit update destroy]

  def new
    @note = Note.new
  end

  def create
    @note = Note.new(note_params)

    if @note.save
      redirect_to root_path
    else
      flash[:notice] = @note.errors.full_messages.uniq

      redirect_to new_note_path
    end
  end

  def edit; end

  def update; end

  def destroy; end

  private

  def note_params; end

  def set_note
    @note = Note.find(params[:id])
  end
end

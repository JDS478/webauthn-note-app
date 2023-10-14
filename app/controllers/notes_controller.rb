# frozen_string_literal: true

class NotesController < ApplicationController
  layout 'dash'
  before_action :set_note, only: %i[show edit update destroy]

  def show; end

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

  def update
    if @note.update(note_params)
      redirect_to root_path
    else
      flash[:notice] = @note.errors.full_messages.uniq

      redirect_to edit_note_path(@note)
    end
  end

  def destroy
    @note.delete

    redirect_to root_path
  end

  private

  def note_params
    params.require(:note).permit(:title, :content, :user_id)
  end

  def set_note
    @note = Note.find(params[:id])
  end
end

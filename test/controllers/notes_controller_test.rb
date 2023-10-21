# frozen_string_literal: true

require 'test_helper'

class NotesControllerTest < ActionController::TestCase
  setup do
    select_user_session

    @note = notes(:anote)
    @user = users(:someuser)
  end

  test 'should get note show' do
    get :show, params: { id: @note }

    assert_response :success
  end

  test 'should get new note view' do
    get :new

    assert_response :success
  end

  test 'should get edit note view' do
    get :edit, params: { id: @note }

    assert_response :success
  end

  test 'should delete note' do
    assert_difference('Note.count', - 1) do
      delete :destroy, params: {id: @note}
    end

    assert_redirected_to root_path
  end

  test 'should create new notes' do
    assert_difference('Note.count') do
      post :create, params: { note: { title: 'A Note', content: 'Something', user_id: @user } }
    end
    assert_redirected_to root_path

    note = Note.last

    assert_equal('A Note', note.title)
    assert_equal('Something', note.content)
  end

  test 'should update existing note' do
    patch :update, params: { id: @note , note: {content: 'New Content'} }
    @note.reload

    assert_equal('New Content', @note.content)
  end
end

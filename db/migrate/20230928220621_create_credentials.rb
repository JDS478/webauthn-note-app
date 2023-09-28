class CreateCredentials < ActiveRecord::Migration[7.0]
  def change
    create_table :credentials do |t|
      t.string :external_id
      t.string :public_key
      t.references :user, null: false, foreign_key: true
      t.integer :sign_count
      t.string :nickname

      t.timestamps
    end
  end
end

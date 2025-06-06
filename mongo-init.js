db = db.getSiblingDB('finance_manager');

db.createUser({
  user: 'finance_admin',
  pwd: 'finance_secure_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'finance_manager'
    }
  ]
}); 
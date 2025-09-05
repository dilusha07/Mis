<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class FacultyUser extends Model
{
    use HasFactory, SoftDeletes, Notifiable;

    protected $table = 'faculty_users';
    protected $primaryKey = 'id';
    public $timestamps = true;

     /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'user_name',
        'user_email',
        'user_type',
        'first_name',
        'last_name',
        'full_name',
        'gender',
        'contact_number',
        'title',
        'NIC',
        'active_status',
        'created_by',
        'modified_by',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'created_by' => 'integer',
        'modified_by' => 'integer',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // Accessor for user type
    public function getUserType(): string
    {
        return $this->user_type;
    }

    public function isStudent(): bool
    {
        return $this->user_type === 'Student';
    }

    public function isEmployee(): bool
    {
        return $this->user_type === 'Employee';
    }

}

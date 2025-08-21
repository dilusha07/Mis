<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModulePrerequisite extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'pre_module_id',
        'curriculum_id',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the main module that this prerequisite belongs to
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    /**
     * Get the prerequisite module
     */
    public function prerequisiteModule(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'pre_module_id');
    }

    /**
     * Get the curriculum this prerequisite belongs to
     */
    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(Curriculum::class);
    }

    /**
     * Get the user who created this prerequisite
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last modified this prerequisite
     */
    public function modifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BatchSemModule extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'module_prerequisites_id',
        'module_coordinator_id',
        'lecture_id',
        'batch_status_id',
        'semester',
        'module_type',
        'gpa_applicability',
        'allowed_for',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the module that this batch semester module belongs to
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the module prerequisite
     */
    public function modulePrerequisite(): BelongsTo
    {
        return $this->belongsTo(ModulePrerequisite::class, 'module_prerequisites_id');
    }

    /**
     * Get the module coordinator (employee)
     */
    public function moduleCoordinator(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'module_coordinator_id');
    }

    /**
     * Get the lecture (employee)
     */
    public function lecture(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'lecture_id');
    }

    /**
     * Get the batch status
     */
    public function batchStatus(): BelongsTo
    {
        return $this->belongsTo(BatchStatus::class);
    }

    /**
     * Get the user who created this record
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last modified this record
     */
    public function modifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by');
    }
}

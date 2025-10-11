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
        'prerequisites',
        'module_coordinator_id',
        'lecture_id',
        'batch_status_id',
        'gpa_applicability',
        'offering_type',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'prerequisites' => 'json', // This will automatically handle JSON serialization/deserialization
    ];

    /**
     * Get the module that this batch semester module belongs to
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    /**
     * Get the prerequisites as an array
     */
    public function getPrerequisitesAttribute($value)
    {
        return json_decode($value ?? '[]', true);
    }

    /**
     * Set the prerequisites as JSON
     */
    public function setPrerequisitesAttribute($value)
    {
        $this->attributes['prerequisites'] = is_array($value) ? json_encode($value) : $value;
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
        return $this->belongsTo(BatchStatus::class, 'batch_status_id');
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

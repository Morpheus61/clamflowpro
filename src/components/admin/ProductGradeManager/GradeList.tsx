import React from 'react';
import { Tag, Edit2, Trash2 } from 'lucide-react';
import type { ProductGrade } from '../../../db';

interface GradeListProps {
  grades: ProductGrade[];
  onEdit: (grade: ProductGrade) => void;
  onDelete: (id: number) => void;
}

export default function GradeList({ grades, onEdit, onDelete }: GradeListProps) {
  const shellOnGrades = grades.filter(g => g.productType === 'shell-on');
  const meatGrades = grades.filter(g => g.productType === 'meat');

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <GradeSection
        title="Shell-on Grades"
        titleColor="text-green-800"
        bgColor="bg-green-50"
        iconColor="text-green-600"
        grades={shellOnGrades}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <GradeSection
        title="Meat Grades"
        titleColor="text-red-800"
        bgColor="bg-red-50"
        iconColor="text-red-600"
        grades={meatGrades}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

interface GradeSectionProps {
  title: string;
  titleColor: string;
  bgColor: string;
  iconColor: string;
  grades: ProductGrade[];
  onEdit: (grade: ProductGrade) => void;
  onDelete: (id: number) => void;
}

function GradeSection({
  title,
  titleColor,
  bgColor,
  iconColor,
  grades,
  onEdit,
  onDelete
}: GradeSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className={`px-4 py-3 rounded-t-lg ${bgColor}`}>
        <h3 className={`text-lg font-semibold ${titleColor}`}>{title}</h3>
      </div>
      <div className="divide-y">
        {grades.map((grade) => (
          <div key={grade.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <Tag className={`h-5 w-5 ${iconColor}`} />
                  <span className="font-medium text-gray-900">
                    Grade {grade.code} - {grade.name}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{grade.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(grade)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(grade.id!)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {grades.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No grades defined yet
          </div>
        )}
      </div>
    </div>
  );
}
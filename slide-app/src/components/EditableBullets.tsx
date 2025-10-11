import { useState, useEffect } from 'react';

/**
 * Props for EditableBullets component
 */
interface EditableBulletsProps {
  bullets: string[];
  onSave: (bullets: string[]) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

/**
 * EditableBullets - Component for displaying and editing bullet points
 */
export function EditableBullets({ bullets, onSave, isEditing, onToggleEdit }: EditableBulletsProps) {
  const [editedBullets, setEditedBullets] = useState<string[]>(bullets);

  useEffect(() => {
    setEditedBullets(bullets);
  }, [bullets]);

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...editedBullets];
    newBullets[index] = value;
    setEditedBullets(newBullets);
  };

  const handleAddBullet = () => {
    setEditedBullets([...editedBullets, '']);
  };

  const handleRemoveBullet = (index: number) => {
    if (editedBullets.length > 1) {
      setEditedBullets(editedBullets.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const filteredBullets = editedBullets.filter(b => b.trim() !== '');
    onSave(filteredBullets);
    onToggleEdit();
  };

  const handleCancel = () => {
    setEditedBullets(bullets);
    onToggleEdit();
  };

  if (!isEditing) {
    return (
      <div className="h-full flex flex-col justify-center">
        {bullets.length > 0 && (
          <ul className="space-y-4" role="list">
            {bullets.map((bullet, index) => (
              <li
                key={index}
                className="flex items-start text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-200 leading-relaxed animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="inline-block w-2.5 h-2.5 bg-primary-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                <span className="flex-1">{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onToggleEdit}
          className="mt-4 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Edit bullet points"
        >
          ✏️ Edit
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-2">
        {editedBullets.map((bullet, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-primary-500 rounded-full mt-3 flex-shrink-0" />
            <textarea
              value={bullet}
              onChange={(e) => handleBulletChange(index, e.target.value)}
              className="flex-1 px-3 py-2 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={2}
              placeholder="Enter bullet point text..."
            />
            {editedBullets.length > 1 && (
              <button
                onClick={() => handleRemoveBullet(index)}
                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                title="Remove bullet"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleAddBullet}
          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          + Add Bullet
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          💾 Save
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
